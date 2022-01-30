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
  'user:connected': (data: { userId: string; socketId: string }) => void;
  'user:online': (data: number) => void;
}

export interface ClientToServerEvents {
  /**
   * User
   */
  'user:logout': () => void;
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

    this.setupMiddlewares();
    this.listen();
  }

  private listen() {
    this.io.on('connection', socket => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const onlineController = new OnlineController(socket);
      const { sessionId, userId, userName } = socket.data;
      const isExistSocketData = !!(sessionId && userId && userName);

      /**
       * Set user session and send online count
       */
      if (isExistSocketData) {
        this.sessionStore
          .saveSession(sessionId, { userId, userName, connected: true })
          .then(() => this.sessionStore.getOnlineSessionsCount())
          .then(online => {
            socket.emit('user:online', online);
            socket.broadcast.emit('user:online', online);
          });
      }

      /**
       * Send session to client
       */
      socket.emit('user:session', { sessionId: socket.data.sessionId, userId: socket.data.userId });

      /**
       * Destroy session on user logout request
       */
      socket.on('user:logout', async () => {
        if (isExistSocketData) {
          await this.sessionStore.destroySession(sessionId);
        }
      });

      /**
       * Broadcast to all clients about new connection
       */
      socket.broadcast.emit('user:connected', {
        userId: socket.handshake.auth.userId,
        socketId: socket.id,
      });

      socket.on('disconnect', async () => {
        if (isExistSocketData) {
          const matchingSockets = await this.io.in(userId).allSockets();
          const isDisconnected = matchingSockets.size === 0;

          if (isDisconnected) {
            /**
             * Update connection flag of socket to flase and send online count
             */
            this.sessionStore.saveSession(sessionId, { userId, userName, connected: false });
            this.sessionStore.getOnlineSessionsCount().then(online => socket.broadcast.emit('user:online', online));
          }
        }
      });
    });
  }

  private setupMiddlewares() {
    this.io.use(AuthMiddleware.authenticate);
  }
}

export default new WsService();
