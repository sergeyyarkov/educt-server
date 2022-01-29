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
    const keys = new Set<string>();
    let nextIndex = 0;

    do {
      // eslint-disable-next-line no-await-in-loop
      const [nextIndexAsStr, result] = await this.redisClient.scan(nextIndex, 'MATCH', '*', 'COUNT', 100);
      nextIndex = parseInt(nextIndexAsStr, 10);
      result.forEach(s => keys.add(s));
    } while (nextIndex !== 0);

    const commands = Array.from(keys).map(key => ['hmget', key.split('-')[1], 'userId', 'userName', 'connected']);

    return this.redisClient
      .multi(commands)
      .exec()
      .then(results => results.map(([err, session]) => (err ? undefined : this.transform(session))));
  }

  /**
   * Returns the unique sessions with connected flag `true`
   */
  public async getOnlineSessionsCount() {
    const sessions = await this.getSessions();

    const online = new Set(sessions.filter(s => s?.connected === true).map(s => s?.userId));
    return online.size;
  }

  /**
   * Set session data to redis store
   *
   * @param id Session id
   * @param data Session data
   */
  public async saveSession(id: string, data: SessionDataType): Promise<void> {
    this.redisClient
      .multi()
      .hmset(id, {
        userId: data.userId,
        userName: data.userName,
        connected: data.connected,
      })
      .expire(id, SESSION_TTL)
      .exec();
  }
}

export default RedisSessionStore;
