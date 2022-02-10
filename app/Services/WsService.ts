import { Server } from 'socket.io';
import Redis from '@ioc:Adonis/Addons/Redis';
import AdonisServer from '@ioc:Adonis/Core/Server';

/**
 * Controllers
 */
import OnlineController from 'App/Controllers/Ws/OnlineController';

/**
 * Middlewares
 */
import AuthMiddleware from 'App/Middleware/Ws/Auth';
import RedisSessionStore from 'App/Store/SessionStore';

export interface ServerToClientEvents {
  /**
   * User
   */
  'user:session': (data: { sessionId: string | undefined; userId: string | undefined }) => void;
  'user:connected': (data: { userId: string; userName: string }) => void;
  'user:online': (data: [string, { userId: string; userName: string }][]) => void;

  /**
   * Message
   */
  'message:private': (data: { content: string; from: string; to: string }) => void;
}

export interface ClientToServerEvents {
  /**
   * User
   */
  'user:logout': () => void;
  'user:status': () => void;

  /**
   * Message
   */
  'message:private': (data: { content: string; to: string }) => void;
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
    this.sessionStore = new RedisSessionStore(Redis.connection('session'));

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

      socket.on('message:private', ({ content, to }) => {
        if (isExistSocketData) {
          this.io.to(to).emit('message:private', { content, from: userId, to });
        }
      });

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
