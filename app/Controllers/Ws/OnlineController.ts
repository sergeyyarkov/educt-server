import Ws, { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from 'App/Services/WsService';
import { Socket } from 'socket.io';
import InMemorySessionStore from 'App/Store/SessionStore';
import Logger from '@ioc:Adonis/Core/Logger';

export default class OnlineController {
  public socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  constructor(socket: Socket) {
    this.socket = socket;
    this.onConnected();
    this.onDisconnected();
  }

  /**
   * On socket connected
   */
  public async onConnected() {}

  /**
   * On socket disconnected
   */
  public async onDisconnected() {}
}
