import { RedisConnectionContract } from '@ioc:Adonis/Addons/Redis';
import Logger from '@ioc:Adonis/Core/Logger';
import User from 'App/Models/User';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';

type MessageDataType = {
  from: string;
  to: string;
  content: string;
  time: string;
};

export type ConversationType = {
  userId: string;
  fullname: string;
  lastMessage: MessageDataType;
};

const MESSAGE_TTL = 185 * 24 * 60 * 60; // 185 days
const MAX_MESSAGES_HISTORY = 100;

class RedisMessageStore {
  public redisClient: RedisConnectionContract;

  constructor(redisClient: RedisConnectionContract) {
    this.redisClient = redisClient;
  }

  public async add(firstUserId: string, secondUserId: string, data: MessageDataType): Promise<'OK' | 'ERROR'> {
    try {
      const msgId = nanoid();
      const msgKey = `${firstUserId}:${msgId}`;
      const key = `message:${msgKey}`;

      await this.redisClient
        .multi()
        .hmset(key, {
          from: data.from,
          to: data.to,
          content: data.content,
          time: DateTime.now().toISO(),
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
    } catch (error) {
      Logger.error(error);
      return 'ERROR';
    }
  }

  public async getHistory(firstUserId: string, secondUserId: string): Promise<MessageDataType[]> {
    const convKey = this.createConversationKey(firstUserId, secondUserId);
    const msgKeys = await this.redisClient.lrange(convKey, 0, -1);
    const messages = await Promise.all(msgKeys.map(key => `message:${key}`).map(key => this.getMessage(key)));

    return messages.sort((m1, m2) => new Date(m1.time).valueOf() - new Date(m2.time).valueOf());
  }

  public async getConversations(userId: string): Promise<ConversationType[]> {
    /**
     * Getting conversations that had some message history
     */
    const conversations = await this.redisClient.keys(`conversation:*${userId}*`);
    const userIds = conversations
      .map(id => id.split(':')[1])
      .map(id => (userId !== id.split('&')[0] ? id.split('&')[0] : id.split('&')[1]));

    /**
     * Fetch this users
     */
    const users = await User.query().select('id', 'first_name', 'last_name').where('id', 'in', userIds);

    /**
     * Fetch last message of each conversation
     */
    const result = await Promise.all(
      users.map(async u => {
        const convKey = this.createConversationKey(userId, u.id);
        const msgKey = await this.redisClient.lindex(convKey, 0);
        const lastMessage = await this.getMessage(`message:${msgKey}`);

        return {
          userId: u.id,
          fullname: `${u.first_name} ${u.last_name}`,
          lastMessage,
        };
      })
    );

    return result;
  }

  private async getMessage(key: string): Promise<MessageDataType> {
    const message = (await this.redisClient.hgetall(key)) as MessageDataType;
    return message;
  }

  // eslint-disable-next-line class-methods-use-this
  private createConversationKey(userId1: string, userId2: string): string {
    const [id1, id2] = [userId1, userId2].sort();
    return `conversation:${id1}&${id2}`;
  }
}

export default RedisMessageStore;
