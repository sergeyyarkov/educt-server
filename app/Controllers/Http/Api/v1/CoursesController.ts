import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Datatype
 */
import Role from 'App/Datatypes/Enums/RoleEnum';

/**
 * Models
 */
import Course from 'App/Models/Course';
import User from 'App/Models/User';
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

  private readonly Course: typeof Course;

  private readonly User: typeof User;

  constructor(courseService: CourseService) {
    super();
    this.courseService = courseService;
    this.Course = Course;
    this.User = User;
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
  public async attachStudent({ response, request, params }: HttpContextContract) {
    try {
      const payload = await request.validate(AddCourseToUserValidator);
      const student = await this.User.findOrFail(payload.student_id);
      const course = await this.Course.findOrFail(params.id);

      await course.load('students');
      await student.load('roles');

      const studentRoles = student.roles.map(r => r.slug);

      if (!studentRoles.includes(Role.STUDENT)) {
        throw new Exception(`User cannot be attached to the course without "student" role.`, 400, 'E_USER_ROLE');
      }

      await course.related('students').attach([student.id]);

      return response.ok({
        message: 'Student attached',
        data: 'SUCCESS',
      });
    } catch (error) {
      if (error?.code === '23505')
        throw new Exception('Student already attached to that course', 400, 'E_STUDENT_ATTACHED');

      throw error;
    }
  }

  /**
   * Detach student from course
   */
  public async detachStudent({ response, request, params }: HttpContextContract) {
    const payload = await request.validate(DelCourseFromUserValidator);
    const course = await this.Course.query().preload('students').where('id', params.id).firstOrFail();
    const candidate = course.students.find(student => student.id === payload.student_id);

    if (!candidate) {
      throw new Exception('Student not attached to that course', 400, 'E_STUDENT_NOT_ATTACHED');
    }

    const student = await this.User.findOrFail(payload.student_id);
    await course.related('students').detach([student.id]);

    return response.ok({
      message: 'Student detached',
      data: 'SUCCESS',
    });
  }
}

new Ioc().make(CoursesController);
