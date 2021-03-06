import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

/**
 * Datatypes
 */
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import LessonMaterial from 'App/Models/LessonMaterial';
import LessonVideo from 'App/Models/LessonVideo';

/**
 * Repositories
 */
import CourseRepository from 'App/Repositories/CourseRepository';
import LessonProgressRepository from 'App/Repositories/LessonProgressRepository';
import LessonRepository from 'App/Repositories/LessonRepository';

/**
 * Validators
 */
import CreateLessonValidator from 'App/Validators/Lesson/CreateLessonValidator';
import UpdateLessonValidator from 'App/Validators/Lesson/UpdateLessonValidator';

@inject()
export default class LessonService {
  private courseRepository: CourseRepository;

  private lessonRepository: LessonRepository;

  private lessonProgressRepository: LessonProgressRepository;

  constructor(
    courseRepository: CourseRepository,
    lessonRepository: LessonRepository,
    lessonProgressRepository: LessonProgressRepository
  ) {
    this.courseRepository = courseRepository;
    this.lessonRepository = lessonRepository;
    this.lessonProgressRepository = lessonProgressRepository;
  }

  /**
   * Fetch list of lessons
   *
   * @returns Response
   */
  public async fetchLessons(): Promise<IResponse> {
    const lessons = await this.lessonRepository.getAll();

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched all lessons.',
      data: lessons,
    };
  }

  /**
   * Fetch one lesson by id
   *
   * @param id Lesson id
   * @returns Response
   */
  public async fetchLesson(id: string | number, ctx: HttpContextContract) {
    const lesson = await this.lessonRepository.getById(id);

    if (!lesson) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Lesson not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    await ctx.bouncer.with('LessonPolicy').authorize('view', lesson);

    /**
     * Load lesson with materials
     */
    await lesson.load(loader => loader.load('content').load('materials').load('video'));

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched lesson.',
      data: lesson,
    };
  }

  /**
   * Fetch lesson material by file name
   *
   * @param ctx Http context
   * @param name Filename
   * @returns Response
   */
  public async fetchMaterialFile(ctx: HttpContextContract, name: string): Promise<IResponse<LessonMaterial>> {
    const material = await this.lessonRepository.getMaterialFileByName(name);

    if (!material) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        data: {},
        message: 'Material not found.',
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    /**
     * Allow user to view lesson material
     */
    await material.load('lesson');
    await ctx.bouncer.with('LessonPolicy').authorize('view', material.lesson);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched lesson material.',
      data: material,
    };
  }

  public async fetchVideoFile(ctx: HttpContextContract, name: string): Promise<IResponse<LessonVideo>> {
    const video = await this.lessonRepository.getVideoFileByName(name);

    if (!video) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        data: {},
        message: 'Video not found.',
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    await video.load('lesson');
    await ctx.bouncer.with('LessonPolicy').authorize('view', video.lesson);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched lesson video.',
      data: video,
    };
  }

  /**
   * Fetch progress of lesson by lesson id
   *
   * @param id Lesson id
   * @param ctx Http context
   */
  public async fetchLessonProgress(id: string, ctx: HttpContextContract): Promise<IResponse> {
    const user = await ctx.auth.use('api').authenticate();
    const lesson = await this.lessonRepository.getById(id);

    if (!lesson) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Lesson not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    await ctx.bouncer.with('LessonPolicy').authorize('view', lesson);

    const progress = await this.lessonProgressRepository.get(user.id, lesson.id);

    if (!progress) {
      await this.lessonProgressRepository.create({ user_id: user.id, lesson_id: lesson.id, is_watched: true });
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched lesson progress',
      data: {
        progress,
      },
    };
  }

  /**
   * Create lesson
   *
   * @param data Data input
   * @returns Response
   */
  public async createLesson(data: CreateLessonValidator['schema']['props']): Promise<IResponse> {
    const course = await this.courseRepository.getByIdWithoutRelations(data.course_id);

    if (!course) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    /**
     * Create new lesson
     */
    const lesson = await this.lessonRepository.create(course, data);

    return {
      success: true,
      status: HttpStatusEnum.CREATED,
      message: 'Lesson created.',
      data: lesson,
    };
  }

  /**
   * Delete lesson
   *
   * @param id Lesson id
   * @returns Response
   */
  public async deleteLesson(id: string | number): Promise<IResponse> {
    const lesson = await this.lessonRepository.delete(id);

    if (!lesson) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Lesson not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Lesson deleted.',
      data: lesson,
    };
  }

  /**
   * Update lesson
   *
   * @param id Lesson id
   * @param data Data input
   * @returns Response
   */
  public async updateLesson(id: string | number, data: UpdateLessonValidator['schema']['props']): Promise<IResponse> {
    const lesson = await this.lessonRepository.update(id, data);

    if (!lesson) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Lesson not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Lesson updated.',
      data: lesson,
    };
  }

  /**
   * Fetch content of lesson by id
   *
   * @param id Lesson id
   * @param auth AuthContract
   * @returns Response
   */
  public async fetchLessonContent(id: string | number, ctx: HttpContextContract): Promise<IResponse> {
    const lesson = await this.lessonRepository.getById(id);

    if (!lesson) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Lesson not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    await ctx.bouncer.with('LessonPolicy').authorize('view', lesson);

    /**
     * Load lesson with materials
     */
    await lesson.load(loader => loader.load('content').load('materials'));

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched lesson content.',
      data: lesson.content,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  public async updateOrder(ids: string[]): Promise<IResponse<{}>> {
    /**
     * Update order of lessons
     */
    const params = ids
      .map((id, i) => ({ id, i: i + 1 }))
      .reduce((result: Array<number | string>, { id, i }) => result.concat(id, i), []);

    const query = `
      UPDATE lessons 
      SET display_order = t.display_order 
      FROM (VALUES ${ids.map(() => `(?, ??)`).join(',')}) as t(id, display_order) 
      WHERE t.id = lessons.id
    `;

    await Database.rawQuery(query, params);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Order updated.',
      data: {},
    };
  }
}

new Ioc().make(LessonService);
