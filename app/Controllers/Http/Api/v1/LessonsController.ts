import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Services
 */
import LessonService from 'App/Services/LessonService';

/**
 * Validators
 */
import CreateLessonValidator from 'App/Validators/Lesson/CreateLessonValidator';
import UpdateLessonValidator from 'App/Validators/Lesson/UpdateLessonValidator';

import BaseController from '../../BaseController';

@inject()
export default class LessonsController extends BaseController {
  private lessonService: LessonService;

  constructor(lessonService: LessonService) {
    super();
    this.lessonService = lessonService;
  }

  /**
   * List of all lessons
   * GET /lessons
   */
  public async list(ctx: HttpContextContract) {
    const result = await this.lessonService.fetchLessons();

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Get one by id
   * GET /lessons/:id
   */
  public async show(ctx: HttpContextContract) {
    const result = await this.lessonService.fetchLesson(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Create new lesson
   * POST /lessons
   */
  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateLessonValidator);
    const result = await this.lessonService.createLesson(payload);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Delete lesson by id.
   * DELETE /lessons/:id
   */
  public async delete(ctx: HttpContextContract) {
    const result = await this.lessonService.deleteLesson(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Update lesson by id.
   * PUT /lessons/:id
   */
  public async update(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateLessonValidator);
    const result = await this.lessonService.updateLesson(ctx.params.id, payload);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Get lesson content by id
   * GET /lessons/:id/content
   */
  public async getContent(ctx: HttpContextContract) {
    const result = await this.lessonService.fetchLessonContent(ctx.params.id, ctx);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(LessonsController);
