"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const nanoid_1 = require("nanoid");
const NOTIFICATION_TTL = 185 * 24 * 60 * 60;
class RedisNotificationStore {
    constructor(redisClient) {
        Object.defineProperty(this, "redisClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.redisClient = redisClient;
    }
    async add(userId, content, type) {
        try {
            const id = (0, nanoid_1.nanoid)();
            const key = `notification:${id}`;
            const timestamp = Date.now();
            const notification = {
                id,
                content,
                time: new Date(timestamp).toISOString(),
                type,
            };
            await this.redisClient.zadd(`user:${userId}`, timestamp, key);
            await this.redisClient.multi().hmset(key, notification).expire(key, NOTIFICATION_TTL).exec();
            return notification;
        }
        catch (error) {
            Logger_1.default.error(error);
            return Promise.reject(error);
        }
    }
    async getNotifications(userId) {
        const keys = await this.redisClient.zrevrangebyscore(`user:${userId}`, '+inf', '-inf');
        const notifications = await Promise.all(keys.map(key => this.get(key)));
        return notifications;
    }
    async get(key) {
        const notification = (await this.redisClient.hgetall(key));
        return notification;
    }
    async del(userId, keys) {
        if (keys.length === 0)
            return 0;
        const k = keys.map(v => `notification:${v}`);
        const count = await this.redisClient.zrem(`user:${userId}`, k);
        await this.redisClient.del(k);
        return count;
    }
}
exports.default = RedisNotificationStore;
//# sourceMappingURL=NotificationStore.js.map