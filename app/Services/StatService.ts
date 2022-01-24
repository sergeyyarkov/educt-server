import { inject, Ioc } from '@adonisjs/core/build/standalone';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';
import Database from '@ioc:Adonis/Lucid/Database';

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

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched stat.',
      data: {
        ...count.rows[0],
      },
    };
  }
}

new Ioc().make(StatService);
