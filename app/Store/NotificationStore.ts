import { RedisConnectionContract } from '@ioc:Adonis/Addons/Redis';
import Logger from '@ioc:Adonis/Core/Logger';
import { nanoid } from 'nanoid';

const NOTIFICATION_TTL = 185 * 24 * 60 * 60; // 185 days

type NotificationType = {
  content: string;
  time: string;
};

class RedisNotificationStore {
  public redisClient: RedisConnectionContract;

  constructor(redisClient: RedisConnectionContract) {
    this.redisClient = redisClient;
  }

  public async add(userId: string, message: string): Promise<'OK' | 'ERROR'> {
    try {
      const key = `notification:${nanoid()}`;
      const timestamp = Date.now();

      await this.redisClient.zadd(`user:${userId}`, timestamp, key);
      await this.redisClient
        .multi()
        .hmset(key, {
          content: message,
          time: new Date(timestamp).toISOString(),
        })
        .expire(key, NOTIFICATION_TTL)
        .exec();

      return 'OK';
    } catch (error) {
      Logger.error(error);
      return 'ERROR';
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
}

export default RedisNotificationStore;
