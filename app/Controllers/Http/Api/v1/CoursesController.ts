import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Services
 */
import CourseService from 'App/Services/CourseService';

/**
 * Validators
 */
import AddCourseToUserValidator from 'App/Validators/Course/AddCourseToUserValidator';
import CreateCourseValidator from 'App/Validators/Course/CreateCourseValidator';
import DelCourseFromUserValidator from 'App/Validators/Course/DelCourseFromUserValidator';
import UpdateCourseValidator from 'App/Validators/Course/UpdateCourseValidator';

import BaseController from '../../BaseController';

@inject()
export default class CoursesController extends BaseController {
  private courseService: CourseService;

  constructor(courseService: CourseService) {
    super();
    this.courseService = courseService;
  }

  /**
   * List of all Courses
   * GET /courses
   */
  public async list(ctx: HttpContextContract) {
    const result = await this.courseService.fetchCourses();

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Show Course by "id"
   * GET /courses/:id
   */
  public async show(ctx: HttpContextContract) {
    const result = await this.courseService.fetchCourse(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Show Teacher of Course with "id"
   * GET /courses/:id/teacher
   */
  public async showTeacher(ctx: HttpContextContract) {
    const result = await this.courseService.fetchCourseTeacher(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Show Category of Course with "id"
   * GET /courses/:id/category
   */
  public async showCategory(ctx: HttpContextContract) {
    const result = await this.courseService.fetchCourseCategory(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Show Lessons of ourse with "id"
   * GET /courses/:id/lessons
   */
  public async showLessons(ctx: HttpContextContract) {
    const result = await this.courseService.fetchCourseLessons(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Show Students of Course with "id"
   * GET /courses/:id/students
   */
  public async showStudents(ctx: HttpContextContract) {
    const result = await this.courseService.fetchCourseStudents(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Create new Course in a system
   * POST /courses
   */
  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateCourseValidator);
    const result = await this.courseService.createCourse(payload);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Delete Course by "id"
   * DELETE /courses/:id
   */
  public async delete(ctx: HttpContextContract) {
    const result = await this.courseService.deleteCourse(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Update Course by "id"
   * PATCH /courses/:id
   */
  public async update(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateCourseValidator);
    const result = await this.courseService.updateCourse(ctx.params.id, payload);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Attach student to course
   * POST /courses/:id/attach-student
   */
  public async attachStudent(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(AddCourseToUserValidator);
    const result = await this.courseService.attachUserCourse(ctx.params.id, payload.student_id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Detach student from course
   */
  public async detachStudent(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(DelCourseFromUserValidator);
    const result = await this.courseService.detachUserCourse(ctx.params.id, payload.student_id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  public async studentsCount(ctx: HttpContextContract) {
    const result = await this.courseService.fetchStudentsCount(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(CoursesController);
