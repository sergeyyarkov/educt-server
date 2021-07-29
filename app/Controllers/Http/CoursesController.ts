import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Course from 'App/Models/Course';
import User from 'App/Models/User';
import CreateCourseValidator from 'App/Validators/CreateCourseValidator';
import UpdateCourseValidator from 'App/Validators/UpdateCourseValidator';

export default class CoursesController {
  private readonly Course: typeof Course;

  private readonly User: typeof User;

  constructor() {
    this.Course = Course;
    this.User = User;
  }

  /**
   * List of all Courses
   * GET /courses
   */
  public async index({ response }: HttpContextContract) {
    const courses = await this.Course.query().preload('teacher').preload('category').preload('lessons');

    return response.ok({
      message: 'Fetched all courses.',
      data: courses,
    });
  }

  /**
   * Show Course by "id"
   * GET /courses/:id
   */
  public async show({ response, params }: HttpContextContract) {
    const course = await this.Course.query()
      .preload('teacher')
      .preload('category')
      .preload('lessons')
      .where('id', params.id)
      .firstOrFail();

    return response.ok({
      message: `Fetched course with id: "${course.id}"`,
      data: course,
    });
  }

  /**
   * Show Teacher of Course with "id"
   * GET /courses/:id/teacher
   */
  public async showTeacher({ response, params }: HttpContextContract) {
    const course = await this.Course.query()
      .select('teacher_id')
      .preload('teacher', user => user.preload('contacts').preload('roles'))
      .where('id', params.id)
      .firstOrFail();

    return response.ok({
      message: `Fetched teacher by courseId: "${params.id}"`,
      data: course.teacher,
    });
  }

  /**
   * Show Category of Course with "id"
   * GET /courses/:id/category
   */
  public async showCategory({ response, params }: HttpContextContract) {
    const course = await this.Course.query()
      .select('category_id')
      .preload('category')
      .where('id', params.id)
      .firstOrFail();

    return response.ok({
      message: `Fetched category by courseId: "${params.id}"`,
      data: course.category,
    });
  }

  /**
   * Show Lessons of ourse with "id"
   * GET /courses/:id/lessons
   */
  public async showLessons({ response, params }: HttpContextContract) {
    const course = await this.Course.query().select('id').preload('lessons').where('id', params.id).firstOrFail();

    return response.ok({
      message: `Fetched lessons by courseId: "${params.id}"`,
      data: course.lessons,
    });
  }

  /**
   * Show Students of Course with "id"
   */
  public async showStudents({ response, params }: HttpContextContract) {}

  /**
   * Create new Course in a system
   * POST /courses
   */
  public async create({ response, request }: HttpContextContract) {
    const payload = await request.validate(CreateCourseValidator);

    const teacher = await this.User.findOrFail(payload.teacher_id);
    await teacher.load('roles');

    /**
     * Check user on role Teacher
     */
    const roles = teacher.roles.map(r => r.slug);
    if (!roles.includes('teacher')) {
      throw new Exception(`User with id "${teacher.id}" not teacher.`, 400, 'ERR_USER_NOT_TEACHER');
    }

    const course = await this.Course.create({
      title: payload.title,
      description: payload.description,
      teacher_id: teacher.id,
      category_id: payload.category_id,
    });

    await course.save();

    return response.created({
      message: 'Course has been created',
      data: course,
    });
  }

  /**
   * Delete Course by "id"
   * DELETE /courses/:id
   */
  async destroy({ response, params }: HttpContextContract) {
    const course = await this.Course.query()
      .preload('teacher')
      .preload('category')
      .preload('lessons')
      .where('id', params.id)
      .firstOrFail();

    await course.delete();

    return response.ok({
      message: `Course with id "${params.id}" has been deleted.`,
      data: course,
    });
  }

  /**
   * Update Course by "id"
   * PATCH /courses/:id
   */
  async update({ response, request, params }: HttpContextContract) {
    const payload = await request.validate(UpdateCourseValidator);
    const course = await this.Course.findOrFail(params.id);

    /**
     * Update course
     */
    Object.keys(payload).forEach(k => {
      if (payload[k] !== undefined) {
        course[k] = payload[k];
      }
    });

    await course.save();
    await course.load('category');
    await course.load('lessons');
    await course.load('teacher');

    return response.ok({
      message: `Course with id: "${course.id}" was successfully updated.`,
      data: course,
    });
  }
}
