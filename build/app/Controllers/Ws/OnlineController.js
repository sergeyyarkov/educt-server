"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OnlineController {
    constructor(socket, io, sessionStore) {
        Object.defineProperty(this, "socket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        this.socket = socket;
        this.io = io;
        this.sessionStore = sessionStore;
    }
    handle() {
        this.onConnected(this.socket);
        this.socket.on('disconnect', reason => this.onDisconnected(reason));
    }
    sendOnline(online) {
        this.io.sockets.emit('user:online', online);
    }
    setUserOnline() {
        const { sessionId, userId, userName } = this.socket.data;
        if (sessionId && userId && userName) {
            this.sessionStore
                .saveSession(sessionId, { userId, userName, connected: true })
                .then(() => this.sessionStore.getOnlineSessions())
                .then(online => this.sendOnline(online));
        }
    }
    async setUserOffline() {
        if (this.socket.data.userName && this.socket.data.sessionId && this.socket.data.userId) {
            const matchingSockets = await this.io.in(this.socket.data.userId).allSockets();
            const isDisconnected = matchingSockets.size === 0;
            if (isDisconnected) {
                const { sessionId, userId, userName } = this.socket.data;
                this.sessionStore
                    .saveSession(sessionId, { userId, userName, connected: false })
                    .then(() => this.sessionStore.getOnlineSessions())
                    .then(online => this.socket.broadcast.emit('user:online', online));
            }
        }
    }
    async onConnected(socket) {
        this.setUserOnline();
        if (this.socket.data.userName && this.socket.data.sessionId && this.socket.data.userId) {
            socket.broadcast.emit('user:connected', { userId: this.socket.data.userId, userName: this.socket.data.userName });
        }
        socket.on('user:status', () => this.setUserOnline());
    }
    onDisconnected(_reason) {
        this.setUserOffline();
    }
}
exports.default = OnlineController;
//# sourceMappingURL=OnlineController.js.map