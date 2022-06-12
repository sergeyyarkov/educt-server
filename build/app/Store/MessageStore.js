"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const luxon_1 = require("luxon");
const nanoid_1 = require("nanoid");
const MESSAGE_TTL = 185 * 24 * 60 * 60;
const MAX_MESSAGES_HISTORY = 100;
class RedisMessageStore {
    constructor(redisClient) {
        Object.defineProperty(this, "redisClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.redisClient = redisClient;
    }
    async add(firstUserId, secondUserId, data) {
        try {
            const msgId = (0, nanoid_1.nanoid)();
            const msgKey = `${firstUserId}:${msgId}`;
            const key = `message:${msgKey}`;
            await this.redisClient
                .multi()
                .hmset(key, {
                from: data.from,
                to: data.to,
                content: data.content,
                time: luxon_1.DateTime.now().toISO(),
            })
                .expire(key, MESSAGE_TTL)
                .exec();
            const convKey = this.createConversationKey(firstUserId, secondUserId);
            const msgKeys = await this.redisClient.lrange(convKey, 0, -1);
            await this.redisClient.lpush(convKey, msgKey);
            if (msgKeys.length >= MAX_MESSAGES_HISTORY) {
                const deletedMsgKey = await this.redisClient.rpop(convKey);
                await this.redisClient.del(`message:${deletedMsgKey}`);
            }
            return 'OK';
        }
        catch (error) {
            Logger_1.default.error(error);
            return 'ERROR';
        }
    }
    async getHistory(firstUserId, secondUserId) {
        const convKey = this.createConversationKey(firstUserId, secondUserId);
        const msgKeys = await this.redisClient.lrange(convKey, 0, -1);
        const messages = await Promise.all(msgKeys.map(key => `message:${key}`).map(key => this.getMessage(key)));
        return messages.sort((m1, m2) => new Date(m1.time).valueOf() - new Date(m2.time).valueOf());
    }
    async getConversations(userId) {
        const conversations = await this.redisClient.keys(`conversation:*${userId}*`);
        const userIds = conversations
            .map(id => id.split(':')[1])
            .map(id => (userId !== id.split('&')[0] ? id.split('&')[0] : id.split('&')[1]));
        const users = await User_1.default.query().select('id', 'first_name', 'last_name').where('id', 'in', userIds);
        const result = await Promise.all(users.map(async (u) => {
            const convKey = this.createConversationKey(userId, u.id);
            const msgKey = await this.redisClient.lindex(convKey, 0);
            const lastMessage = await this.getMessage(`message:${msgKey}`);
            return {
                userId: u.id,
                fullname: `${u.first_name} ${u.last_name}`,
                lastMessage,
            };
        }));
        return result;
    }
    async getMessage(key) {
        const message = (await this.redisClient.hgetall(key));
        return message;
    }
    createConversationKey(userId1, userId2) {
        const [id1, id2] = [userId1, userId2].sort();
        return `conversation:${id1}&${id2}`;
    }
}
exports.default = RedisMessageStore;
//# sourceMappingURL=MessageStore.js.map