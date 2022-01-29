import Redis from '@ioc:Adonis/Addons/Redis';
import AdonisServer from '@ioc:Adonis/Core/Server';
import { Server } from 'socket.io';

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
  'user:logout': (data: { sessionId: string }) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  sessionId?: string | undefined;
  userId?: string | undefined;
  userName?: string | undefined;
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
      const onlineController = new OnlineController(socket);

      /**
       * Set user session and send online count
       */
      this.sessionStore
        .saveSession(socket.data.sessionId, {
          sessionId: socket.data.sessionId,
          userId: socket.data.userId,
          userName: socket.data.userName,
          connected: true,
        })
        .then(async () => {
          const online = await this.sessionStore.getOnlineSessionsCount();
          socket.emit('user:online', online);
          socket.broadcast.emit('user:online', online);
        });

      /**
       * Send session to client
       */
      socket.emit('user:session', { sessionId: socket.data.sessionId, userId: socket.data.userId });

      /**
       * Broadcast to all clients about new connection
       */
      socket.broadcast.emit('user:connected', {
        userId: socket.handshake.auth.userId,
        socketId: socket.id,
      });

      socket.on('disconnect', async () => {
        const matchingSockets = await this.io.in(socket.data.userId).allSockets();
        const isDisconnected = matchingSockets.size === 0;

        if (isDisconnected) {
          /**
           * Update connection flag of socket to flase
           */
          this.sessionStore.saveSession(socket.data.sessionId, {
            sessionId: socket.data.sessionId,
            userId: socket.data.userId,
            userName: socket.data.userName,
            connected: false,
          });

          this.sessionStore.getOnlineSessionsCount().then(online => socket.broadcast.emit('user:online', online));
        }
      });
    });
  }

  private setupMiddlewares() {
    this.io.use(AuthMiddleware.authenticate);
  }
}

export default new WsService();
