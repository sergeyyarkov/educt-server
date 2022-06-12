"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Server_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Server"));
const luxon_1 = require("luxon");
const OnlineController_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Controllers/Ws/OnlineController"));
const Auth_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Middleware/Ws/Auth"));
const SessionStore_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Store/SessionStore"));
const MessageStore_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Store/MessageStore"));
const NotificationStore_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Store/NotificationStore"));
class WsService {
    constructor() {
        Object.defineProperty(this, "io", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "messageStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "notificationStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "booted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    boot() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        this.io = new socket_io_1.Server(Server_1.default.instance, {
            cors: {
                origin: 'http://localhost:3000',
                credentials: true,
            },
        });
        this.sessionStore = new SessionStore_1.default(Redis_1.default.connection('session'));
        this.messageStore = new MessageStore_1.default(Redis_1.default.connection('message'));
        this.notificationStore = new NotificationStore_1.default(Redis_1.default.connection('notification'));
        this.sessionStore.destroyAllSessions().then(() => {
            this.setupMiddlewares();
            this.listen();
        });
    }
    listen() {
        this.io.on('connection', async (socket) => {
            const onlineController = new OnlineController_1.default(socket, this.io, this.sessionStore);
            onlineController.handle();
            const { sessionId, userId, userName } = socket.data;
            const isExistSocketData = !!(sessionId && userId && userName);
            if (isExistSocketData) {
                socket.join(userId);
            }
            socket.emit('user:session', { sessionId: socket.data.sessionId, userId: socket.data.userId });
            socket.on('chat:message', async ({ content, to }) => {
                if (isExistSocketData) {
                    const message = {
                        content,
                        from: userId,
                        to,
                        time: luxon_1.DateTime.now().toISO(),
                    };
                    await this.messageStore.add(userId, to, message);
                    if (userId !== to) {
                        const notification = await this.notificationStore.add(to, `You received a new private message`, 'MESSAGE');
                        this.io.to(to).emit('chat:message', { ...message, notificationId: notification.id });
                    }
                    else {
                        this.io.to(to).emit('chat:message', { ...message });
                    }
                }
            });
            socket.on('notification:read', data => this.notificationStore.del(data.userId, data.ids));
            socket.on('user:logout', async () => {
                if (isExistSocketData) {
                    await this.sessionStore.destroySession(sessionId);
                }
            });
        });
    }
    setupMiddlewares() {
        this.io.use(Auth_1.default.authenticate);
    }
}
exports.default = new WsService();
//# sourceMappingURL=WsService.js.map