import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Models
 */
import Lesson from 'App/Models/Lesson';
import Course from 'App/Models/Course';

/**
 * Validators
 */
import CreateLessonValidator from 'App/Validators/Lesson/CreateLessonValidator';
import UpdateLessonValidator from 'App/Validators/Lesson/UpdateLessonValidator';

import BaseController from '../../BaseController';

export default class LessonsController extends BaseController {
  private readonly Lesson: typeof Lesson;

  private readonly Course: typeof Course;

  constructor() {
    super();
    this.Lesson = Lesson;
    this.Course = Course;
  }

  /**
   * List of all lessons
   * GET /lessons
   */
  public async list(ctx: HttpContextContract) {
    const lessons = await this.Lesson.query();

    return this.sendResponse(ctx, lessons, 'Fetched list lessons.');
  }

  /**
   * Get one by id
   * GET /lessons/:id
   */
  public async show(ctx: HttpContextContract) {
    const lesson = await this.Lesson.findOrFail(ctx.params.id);

    return this.sendResponse(ctx, lesson, 'Fetched lesson by id.');
  }

  /**
   * Create new lesson
   * POST /lessons
   */
  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateLessonValidator);
    const course = await this.Course.findOrFail(payload.course_id);
    const lesson = await this.Lesson.create({
      title: payload.title,
      description: payload.description,
    });

    await lesson.related('course').associate(course);
    await lesson.related('content').create({
      video_url: payload.video_url,
    });

    await lesson.load('content');

    return this.sendResponse(ctx, lesson, 'Created new lesson.');
  }

  /**
   * Delete lesson by id.
   * DELETE /lessons/:id
   */
  public async delete(ctx: HttpContextContract) {
    const lesson = await this.Lesson.findOrFail(ctx.params.id);

    await lesson.delete();

    return this.sendResponse(ctx, lesson, 'Lesson deleted.');
  }

  /**
   * Update lesson by id.
   * PUT /lessons/:id
   */
  public async update(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateLessonValidator);
    const lesson = await this.Lesson.firstOrFail(ctx.params.id);

    await lesson
      .merge({
        course_id: payload.course_id,
        title: payload.title,
        description: payload.description,
      })
      .save();

    return this.sendResponse(ctx, lesson, 'Lesson updated.');
  }

  /**
   * Get lesson content by id
   * GET /lessons/:id/content
   */
  public async getContent(ctx: HttpContextContract) {
    const lesson = await this.Lesson.query().preload('content').where('id', ctx.params.id).firstOrFail();

    return this.sendResponse(ctx, lesson.content, 'Lesson content fetched.');
  }
}
