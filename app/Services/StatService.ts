import { inject, Ioc } from '@adonisjs/core/build/standalone';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';
import Database from '@ioc:Adonis/Lucid/Database';
import Ws from './WsService';

@inject()
export default class StatService {
  /**
   * Get basic statistics about the system
   *
   * @returns Response
   */
  // eslint-disable-next-line class-methods-use-this
  public async fetchStatData(): Promise<IResponse> {
    const count = await Database.rawQuery(
      `
        select (select count(*) from courses) as courses_count,
        (select count(*) from lessons) as lessons_count
      `
    );

    const online = await Ws.sessionStore.getOnlineSessions();

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched stat.',
      data: {
        ...count.rows[0],
        online: online.length,
      },
    };
  }
}

new Ioc().make(StatService);
