/* eslint-disable max-classes-per-file */
import { RedisConnectionContract } from '@ioc:Adonis/Addons/Redis';

type SessionDataType = { userId: string; userName: string; connected: boolean };

const SESSION_TTL = 24 * 60 * 60; // 1 day

class RedisSessionStore {
  public redisClient: RedisConnectionContract;

  constructor(redisClient: RedisConnectionContract) {
    this.redisClient = redisClient;
  }

  // eslint-disable-next-line class-methods-use-this
  private transform(values: (string | null)[]) {
    const [userId, userName, connected] = values;

    if (!userId || !userName || !connected) return undefined;

    return {
      userId,
      userName,
      connected: connected === 'true',
    };
  }

  private async scanSessionKeys(): Promise<Set<string>> {
    const keys = new Set<string>();
    let nextIndex = 0;

    do {
      // eslint-disable-next-line no-await-in-loop
      const [nextIndexAsStr, result] = await this.redisClient.scan(nextIndex, 'MATCH', '*', 'COUNT', 100);
      nextIndex = parseInt(nextIndexAsStr, 10);
      result.forEach(s => keys.add(s));
    } while (nextIndex !== 0);

    return keys;
  }

  /**
   * Return session data by session id
   *
   * @param id Session id
   * @returns Session data
   */
  public async findSession(id: string): Promise<SessionDataType | undefined> {
    const values = await this.redisClient.hmget(id, 'userId', 'userName', 'connected');
    return this.transform(values);
  }

  /**
   * Returns the all sessions from store
   */
  public async getSessions(): Promise<Array<SessionDataType | undefined>> {
    const keys = await this.scanSessionKeys();
    const commands = Array.from(keys).map(key => {
      const [, ...id] = key.split('-');
      return ['hmget', id.join('-'), 'userId', 'userName', 'connected'];
    });

    return this.redisClient
      .multi(commands)
      .exec()
      .then(results => {
        if (results === null) return [];
        return results.map(([err, session]: [Error, (string | null)[]]) => (err ? undefined : this.transform(session)));
      });
  }

  /**
   * Returns the unique sessions with connected flag `true`
   */
  public async getOnlineSessions() {
    const sessions = await this.getSessions();
    const online = new Map<string, { userId: string; userName: string }>();

    sessions.forEach(s => {
      if (s?.connected === true) {
        online.set(s.userId, s);
      }
    });

    return Array.from(online);
  }

  /**
   * Set session data to redis store
   *
   * @param id Session id
   * @param data Session data
   */
  public async saveSession(id: string, data: SessionDataType): Promise<void> {
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

  /**
   * Remove session from redis store
   *
   * @param id Session id
   */
  public async destroySession(id: string): Promise<number> {
    const session = await this.findSession(id);

    if (session) {
      return this.redisClient.del(id);
    }

    return 0;
  }

  /**
   * Remove all sessions from redis store
   *
   * @returns Count of deleted sessions
   */
  public async destroyAllSessions() {
    const keys = await this.scanSessionKeys().then(values =>
      Array.from(values).map(v => {
        const [, ...key] = v.split('-');
        return key.join('-');
      })
    );

    if (keys.length > 0) {
      const deleted = await this.redisClient.del(keys);
      return deleted;
    }

    return 0;
  }
}

export default RedisSessionStore;
