/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid';
import Redis from '@ioc:Adonis/Addons/Redis';
import CookieHelper from 'App/Helpers/CookieHelper';
import OpaqueTokenHelper from 'App/Helpers/OpaqueTokenHelper';
import Ws, { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from 'App/Services/WsService';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export default class AuthMiddleware {
  /**
   * Checks the cookie token in headers and
   * validates the opaque token
   *
   * @param socket
   * @param next
   * @returns void
   */
  public static async authenticate(
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    next: (err?: ExtendedError | undefined) => void
  ) {
    /**
     * Parse and validate token from cookie
     */
    const cookie = socket.handshake.headers?.cookie;

    if (!cookie) {
      return next(new Error('SocketErrors.MissingParameter'));
    }

    const token = CookieHelper.parseCookieString(cookie)?.token;

    if (!token) {
      return next(new Error('SocketErrors.MissingParameter'));
    }

    const tokenData = JSON.parse(Buffer.from(token.split('.')[0].split(':')[1], 'base64').toString('utf-8'));
    const parsed = OpaqueTokenHelper.parseToken(tokenData.message);
    const data = await Redis.get(`api:${parsed.id}`);

    if (!data) {
      return next(new Error('SocketErrors.BadCredentials'));
    }

    /**
     * Assign existing session to socket data
     */
    const sessionId = socket.handshake.auth.sessionId as string | undefined;

    if (sessionId) {
      const session = await Ws.sessionStore.findSession(sessionId);

      if (session) {
        socket.data.sessionId = sessionId;
        socket.data.userId = session.userId;
        socket.data.userName = session.userName;

        return next();
      }
    }

    /**
     * Parse data from redis string and create new session
     */
    const parsedData = JSON.parse(data);

    /**
     * Set custom data to socket
     */
    socket.data.sessionId = nanoid();
    socket.data.userId = parsedData.user_id as string;
    socket.data.userName = parsedData.userName as string;

    return next();
  }
}
