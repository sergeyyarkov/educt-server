import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Models
 */
import LessonVideo from 'App/Models/LessonVideo';

/**
 * Services
 */
import LessonService from 'App/Services/LessonService';

import BaseController from './BaseController';

@inject()
export default class VideosController extends BaseController {
  private lessonService: LessonService;

  constructor(lessonService: LessonService) {
    super();
    this.lessonService = lessonService;
  }

  /**
   * Get video file of lesson by file name
   * GET /video/:fileName
   */
  public async getVideo(ctx: HttpContextContract) {
    const { fileName } = ctx.request.params();
    const { data, message, status, success, error } = await this.lessonService.fetchVideoFile(ctx, fileName);

    if (!success && error) {
      throw new Exception(message, status, error.code);
    }

    if (data instanceof LessonVideo) {
      /**
       * Allow user to control video
       */
      ctx.response.header('Accept-Ranges', 'bytes');

      /**
       * Send video
       */
      return this.sendFileFromDrive(`videos/${data.name}`, ctx);
    }

    return this.sendResponse(ctx, data, message, status);
  }
}

new Ioc().make(VideosController);
