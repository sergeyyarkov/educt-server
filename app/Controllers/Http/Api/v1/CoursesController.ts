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
import AttachStudentsValitator from 'App/Validators/Course/AttachStudentsValitator';
import DetachStudentstValitator from 'App/Validators/Course/DetachStudentstValitator';
import CreateCourseValidator from 'App/Validators/Course/CreateCourseValidator';
import DelCourseFromUserValidator from 'App/Validators/Course/DelCourseFromUserValidator';
import SetCourseStatusValidator from 'App/Validators/Course/SetCourseStatusValidator';
import UpdateCourseValidator from 'App/Validators/Course/UpdateCourseValidator';
import FetchCoursesValidator from 'App/Validators/Course/FetchCoursesValidator';

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
    const payload = await ctx.request.validate(FetchCoursesValidator);
    const result = await this.courseService.fetchCourses(payload);

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
   * Attach list of students to course
   * POST /courses/:id/attach-student-list
   */
  public async attachStudentList(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(AttachStudentsValitator);
    const result = await this.courseService.attachStudentList(ctx.params.id, payload.students);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Detach student from course
   * DELETE /courses/:id/detach-student
   */
  public async detachStudent(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(DelCourseFromUserValidator);
    const result = await this.courseService.detachUserCourse(ctx.params.id, payload.student_id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Detach list of students to course
   * POST /courses/:id/detach-student-list
   */
  public async detachStudentList(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(DetachStudentstValitator);
    const result = await this.courseService.detachStudentList(ctx.params.id, payload.students);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Fetch count of students of course
   * GET /courses/:id/students/count
   */
  public async studentsCount(ctx: HttpContextContract) {
    const result = await this.courseService.fetchStudentsCount(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Get likes count of course
   * GET /courses/:id/likes
   */
  public async showLikes(ctx: HttpContextContract) {
    const result = await this.courseService.fetchCourseLikesCount(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Set like on course by authorized user
   * PUT /courses/:id/likes
   */
  public async setLike(ctx: HttpContextContract) {
    const result = await this.courseService.attachUserLike(ctx.params.id, ctx.auth);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Unset like on course by authorized user
   * DELETE /courses/:id/likes
   */
  public async unsetLike(ctx: HttpContextContract) {
    const result = await this.courseService.detachUserLike(ctx.params.id, ctx.auth);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Set course status
   * POST /courses/:id/set-status
   */
  public async setStatus(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(SetCourseStatusValidator);
    const result = await this.courseService.setCourseStatus(ctx.params.id, payload.status);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(CoursesController);
