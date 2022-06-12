"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const CookieHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/CookieHelper"));
const OpaqueTokenHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/OpaqueTokenHelper"));
const WsService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/WsService"));
class AuthMiddleware {
    static async authenticate(socket, next) {
        const cookie = socket.handshake.headers?.cookie;
        if (!cookie) {
            return next(new Error('SocketErrors.MissingParameter'));
        }
        const token = CookieHelper_1.default.parseCookieString(cookie)?.token;
        if (!token) {
            return next(new Error('SocketErrors.MissingParameter'));
        }
        const tokenData = JSON.parse(Buffer.from(token.split('.')[0].split(':')[1], 'base64').toString('utf-8'));
        const parsed = OpaqueTokenHelper_1.default.parseToken(tokenData.message);
        const data = await Redis_1.default.get(`api:${parsed.id}`);
        if (!data) {
            return next(new Error('SocketErrors.BadCredentials'));
        }
        const sessionId = socket.handshake.auth.sessionId;
        if (sessionId) {
            const session = await WsService_1.default.sessionStore.findSession(sessionId);
            if (session) {
                socket.data.sessionId = sessionId;
                socket.data.userId = session.userId;
                socket.data.userName = session.userName;
                return next();
            }
        }
        const parsedData = JSON.parse(data);
        socket.data.sessionId = (0, nanoid_1.nanoid)();
        socket.data.userId = parsedData.user_id;
        socket.data.userName = parsedData.userName;
        return next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map