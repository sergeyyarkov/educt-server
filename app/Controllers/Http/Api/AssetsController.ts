import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';

/**
 * Services
 */
import AssetsService from 'App/Services/AssetsService';

import BaseController from '../BaseController';

@inject()
export default class AssetsController extends BaseController {
  private assetsService: AssetsService;

  constructor(assetsService: AssetsService) {
    super();
    this.assetsService = assetsService;
  }

  /**
   * Send background image of course
   * GET /media/images/courses/:fileName
   */
  public async serveCourseImage(ctx: HttpContextContract) {
    const result = await this.assetsService.getCourseImagePath(ctx.params.fileName);

    if (typeof result !== 'string') {
      if (!result.success && result.error) {
        throw new Exception(result.message, result.status, result.error.code);
      }

      return this.sendResponse(ctx, result.data, result.message, result.status);
    }

    return this.sendFile(ctx, result);
  }
}

new Ioc().make(AssetsController);
