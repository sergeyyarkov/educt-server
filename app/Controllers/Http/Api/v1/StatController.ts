import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import StatService from 'App/Services/StatService';

import BaseController from '../../BaseController';

@inject()
export default class StatController extends BaseController {
  private statService: StatService;

  constructor(statService: StatService) {
    super();
    this.statService = statService;
  }

  /**
   * Return current stat about system
   * GET /stat
   */
  public async index(ctx: HttpContextContract) {
    const result = await this.statService.fetchStatData();

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(StatController);
