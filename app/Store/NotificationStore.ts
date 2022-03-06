import { RedisConnectionContract } from '@ioc:Adonis/Addons/Redis';
import Logger from '@ioc:Adonis/Core/Logger';
import { nanoid } from 'nanoid';

const NOTIFICATION_TTL = 185 * 24 * 60 * 60; // 185 days

type NotificationType = {
  id: string;
  type: 'SYSTEM' | 'MESSAGE';
  content: string;
  time: string;
};

class RedisNotificationStore {
  public redisClient: RedisConnectionContract;

  constructor(redisClient: RedisConnectionContract) {
    this.redisClient = redisClient;
  }

  public async add(userId: string, content: string, type: NotificationType['type']): Promise<NotificationType> {
    try {
      const id = nanoid();
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
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }

  public async getNotifications(userId: string) {
    const keys = await this.redisClient.zrevrangebyscore(`user:${userId}`, '+inf', '-inf');
    const notifications = await Promise.all(keys.map(key => this.get(key)));
    return notifications;
  }

  private async get(key: string): Promise<NotificationType> {
    const notification = (await this.redisClient.hgetall(key)) as NotificationType;
    return notification;
  }

  public async del(userId: string, keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;

    const k = keys.map(v => `notification:${v}`);
    const count = await this.redisClient.zrem(`user:${userId}`, k);
    await this.redisClient.del(k);

    return count;
  }
}

export default RedisNotificationStore;
