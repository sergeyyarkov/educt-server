import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';

/**
 * Datatypes
 */
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
/**
 * Repositories
 */
import CourseRepository from 'App/Repositories/CourseRepository';
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

  constructor(courseRepository: CourseRepository, lessonRepository: LessonRepository) {
    this.courseRepository = courseRepository;
    this.lessonRepository = lessonRepository;
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
  public async fetchLesson(id: string | number): Promise<IResponse> {
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

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched lesson.',
      data: lesson,
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
  public async fetchLessonContent(id: string | number, auth: AuthContract): Promise<IResponse> {
    const user = await auth.use('api').authenticate();
    await user.load('courses');

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

    await lesson.load('course');

    const userHasCourse = user.courses.find(course => course.id === lesson.course.id);

    if (!userHasCourse) {
      return {
        success: false,
        status: HttpStatusEnum.FORBIDDEN,
        message: 'The user is not a student of this course.',
        data: {},
        error: {
          code: 'E_FORBIDDEN',
        },
      };
    }

    await lesson.load('content');

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched lesson content.',
      data: lesson.content,
    };
  }
}

new Ioc().make(LessonService);
