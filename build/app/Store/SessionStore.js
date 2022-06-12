"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SESSION_TTL = 24 * 60 * 60;
class RedisSessionStore {
    constructor(redisClient) {
        Object.defineProperty(this, "redisClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.redisClient = redisClient;
    }
    transform(values) {
        const [userId, userName, connected] = values;
        if (!userId || !userName || !connected)
            return undefined;
        return {
            userId,
            userName,
            connected: connected === 'true',
        };
    }
    async scanSessionKeys() {
        const keys = new Set();
        let nextIndex = 0;
        do {
            const [nextIndexAsStr, result] = await this.redisClient.scan(nextIndex, 'MATCH', '*', 'COUNT', 100);
            nextIndex = parseInt(nextIndexAsStr, 10);
            result.forEach(s => keys.add(s));
        } while (nextIndex !== 0);
        return keys;
    }
    async findSession(id) {
        const values = await this.redisClient.hmget(id, 'userId', 'userName', 'connected');
        return this.transform(values);
    }
    async getSessions() {
        const keys = await this.scanSessionKeys();
        const commands = Array.from(keys).map(key => {
            const [, ...id] = key.split('-');
            return ['hmget', id.join('-'), 'userId', 'userName', 'connected'];
        });
        return this.redisClient
            .multi(commands)
            .exec()
            .then(results => {
            if (results === null)
                return [];
            return results.map(([err, session]) => (err ? undefined : this.transform(session)));
        });
    }
    async getOnlineSessions() {
        const sessions = await this.getSessions();
        const online = new Map();
        sessions.forEach(s => {
            if (s?.connected === true) {
                online.set(s.userId, s);
            }
        });
        return Array.from(online);
    }
    async saveSession(id, data) {
        await this.redisClient
            .multi()
            .hmset(id, {
            userId: data.userId,
            userName: data.userName,
            connected: data.connected,
        })
            .expire(id, SESSION_TTL)
            .exec();
    }
    async destroySession(id) {
        const session = await this.findSession(id);
        if (session) {
            return this.redisClient.del(id);
        }
        return 0;
    }
    async destroyAllSessions() {
        const keys = await this.scanSessionKeys().then(values => Array.from(values).map(v => {
            const [, ...key] = v.split('-');
            return key.join('-');
        }));
        if (keys.length > 0) {
            const deleted = await this.redisClient.del(keys);
            return deleted;
        }
        return 0;
    }
}
exports.default = RedisSessionStore;
//# sourceMappingURL=SessionStore.js.map