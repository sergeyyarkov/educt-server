import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from 'App/Services/WsService';
import RedisSessionStore from 'App/Store/SessionStore';

export default class OnlineController {
  public socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  public io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  public sessionStore: RedisSessionStore;

  constructor(
    socket: Socket,
    io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    sessionStore: RedisSessionStore
  ) {
    this.socket = socket;
    this.io = io;
    this.sessionStore = sessionStore;

    this.onConnected(socket);

    this.socket.on('disconnect', reason => this.onDisconnected(reason));
  }

  public sendOnlineCount(online: number) {
    this.socket.emit('user:online', online);
    this.socket.broadcast.emit('user:online', online);
  }

  public setUserOnline() {
    const { sessionId, userId, userName } = this.socket.data;

    if (sessionId && userId && userName) {
      /**
       * Set session and send online count
       */
      this.sessionStore
        .saveSession(sessionId, { userId, userName, connected: true })
        .then(() => this.sessionStore.getOnlineSessionsCount())
        .then(online => this.sendOnlineCount(online));
    }
  }

  public async setUserOffline() {
    if (this.socket.data.userName && this.socket.data.sessionId && this.socket.data.userId) {
      const matchingSockets = await this.io.in(this.socket.data.userId).allSockets();
      const isDisconnected = matchingSockets.size === 0;

      if (isDisconnected) {
        const { sessionId, userId, userName } = this.socket.data;
        /**
         * Update connection flag of socket to flase and send online count
         */
        this.sessionStore
          .saveSession(sessionId, { userId, userName, connected: false })
          .then(() => this.sessionStore.getOnlineSessionsCount())
          .then(online => this.socket.broadcast.emit('user:online', online));
      }
    }
  }

  /**
   * On socket connected
   */
  public async onConnected(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    /**
     * Set user online on connected
     */
    this.setUserOnline();

    /**
     * Broadcast to all clients about new connection
     */
    if (this.socket.data.userName && this.socket.data.sessionId && this.socket.data.userId) {
      socket.broadcast.emit('user:connected', { userId: this.socket.data.userId, userName: this.socket.data.userName });
    }

    /**
     * Watch status of user and set session
     */
    socket.on('user:status', () => this.setUserOnline());
  }

  /**
   * On socket disconnected
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onDisconnected(_reason: string) {
    this.setUserOffline();
  }
}
