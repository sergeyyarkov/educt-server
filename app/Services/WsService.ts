import { Server } from 'socket.io';
import Redis from '@ioc:Adonis/Addons/Redis';
import AdonisServer from '@ioc:Adonis/Core/Server';
import { DateTime } from 'luxon';

/**
 * Controllers
 */
import OnlineController from 'App/Controllers/Ws/OnlineController';

/**
 * Middlewares
 */
import AuthMiddleware from 'App/Middleware/Ws/Auth';

/**
 * Stores
 */
import RedisSessionStore from 'App/Store/SessionStore';
import RedisMessageStore from 'App/Store/MessageStore';
import RedisNotificationStore from 'App/Store/NotificationStore';

export interface ServerToClientEvents {
  /**
   * User
   */
  'user:session': (data: { sessionId: string | undefined; userId: string | undefined }) => void;
  'user:connected': (data: { userId: string; userName: string }) => void;
  'user:online': (data: [string, { userId: string; userName: string }][]) => void;

  /**
   * Chat
   */
  'chat:message': (data: {
    content: string;
    time: string;
    from: string;
    to: string;
    notificationId?: string | undefined;
  }) => void;
}

export interface ClientToServerEvents {
  /**
   * User
   */
  'user:logout': () => void;
  'user:status': () => void;

  /**
   * Chat
   */
  'chat:message': (data: { content: string; to: string }) => void;

  /**
   * Notification
   */
  'notification:read': (data: { userId: string; ids: string[] }) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  sessionId: string;
  userId: string;
  userName: string;
}

class WsService {
  public io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  public sessionStore: RedisSessionStore;

  public messageStore: RedisMessageStore;

  public notificationStore: RedisNotificationStore;

  public booted = false;

  public boot() {
    if (this.booted) {
      return;
    }

    this.booted = true;
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });

    /**
     * Stores
     */
    this.sessionStore = new RedisSessionStore(Redis.connection('session'));
    this.messageStore = new RedisMessageStore(Redis.connection('message'));
    this.notificationStore = new RedisNotificationStore(Redis.connection('notification'));

    /**
     * Clean up sessions before start
     */
    this.sessionStore.destroyAllSessions().then(() => {
      /**
       * Middlewares
       */
      this.setupMiddlewares();

      /**
       * On connection socket
       */
      this.listen();
    });
  }

  private listen() {
    this.io.on('connection', async socket => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const onlineController = new OnlineController(socket, this.io, this.sessionStore);

      const { sessionId, userId, userName } = socket.data;
      const isExistSocketData = !!(sessionId && userId && userName);

      if (isExistSocketData) {
        socket.join(userId);
      }

      /**
       * Send session to client
       */
      socket.emit('user:session', { sessionId: socket.data.sessionId, userId: socket.data.userId });

      socket.on('chat:message', async ({ content, to }) => {
        if (isExistSocketData) {
          const message = {
            content,
            from: userId,
            to,
            time: DateTime.now().toISO(),
          };

          await this.messageStore.add(userId, to, message);

          if (userId !== to) {
            const notification = await this.notificationStore.add(to, `You received a new private message`, 'MESSAGE');
            this.io.to(to).emit('chat:message', { ...message, notificationId: notification.id });
          } else {
            this.io.to(to).emit('chat:message', { ...message });
          }
        }
      });

      socket.on('notification:read', data => this.notificationStore.del(data.userId, data.ids));

      /**
       * Destroy session on user logout request
       */
      socket.on('user:logout', async () => {
        if (isExistSocketData) {
          await this.sessionStore.destroySession(sessionId);
        }
      });
    });
  }

  private setupMiddlewares() {
    this.io.use(AuthMiddleware.authenticate);
  }
}

export default new WsService();
