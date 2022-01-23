/* eslint-disable @typescript-eslint/naming-convention */
import Database from '@ioc:Adonis/Lucid/Database';
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite';

/**
 * Datatypes
 */
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';

/**
 * Models
 */
import Category from 'App/Models/Category';
import Course from 'App/Models/Course';
import Lesson from 'App/Models/Lesson';
import User from 'App/Models/User';

/**
 * Validators
 */
import CreateCourseValidator from 'App/Validators/Course/CreateCourseValidator';
import FetchCoursesValidator from 'App/Validators/Course/FetchCoursesValidator';
import UpdateCourseValidator from 'App/Validators/Course/UpdateCourseValidator';

export default class CourseRepository {
  private Database: typeof Database;

  private Course: typeof Course;

  constructor() {
    this.Database = Database;
    this.Course = Course;
  }

  /**
   * Set status on course
   *
   * @param id Course id
   * @returns Data result
   */
  public async setStatus(id: string | number, status: CourseStatusEnum): Promise<any> {
    const data = await this.Course.query().where('id', id).update({ status }).first();
    return data;
  }

  /**
   * Get all courses
   *
   * @returns List of courses
   */
  public async getAll(params?: FetchCoursesValidator['schema']['props']): Promise<Course[]> {
    const { status, category_id, limit } = params || {};

    const query = this.Course.query();

    if (category_id) {
      query.andWhereHas('category', q => q.where('id', category_id));
    }

    if (status) {
      query.andWhere('status', status);
    }

    if (limit) {
      query.limit(limit);
    }

    const courses = await query
      .preload('color')
      .preload('category')
      .withCount('students')
      .withCount('likes')
      .withCount('lessons')
      .orderBy('created_at', 'desc');

    return courses;
  }

  /**
   * Get course by id
   *
   * @param id Course id
   * @returns Course or null
   */
  public async getById(id: string | number): Promise<Course | null> {
    const course = await this.Course.query()
      .preload('teacher')
      .preload('color')
      .preload('category', q => q.preload('color'))
      .preload('lessons', q => q.preload('color').orderBy('display_order', 'asc').withCount('materials'))
      .preload('students', q => q.preload('roles').preload('contacts'))
      .withCount('likes')
      .withCount('lessons')
      .withCount('students')
      .where('id', id)
      .first();

    return course;
  }

  /**
   * Get course by id without relations
   *
   * @param id Course id
   * @returns Course or null
   */
  public async getByIdWithoutRelations(id: string | number, params?: any): Promise<Course | null> {
    const { status }: any = params || {};
    const query = this.Course.query().where('id', id);

    if (status) {
      query.where('status', status);
    }

    const course = await query.first();

    return course;
  }

  /**
   * Get likes count of course by id
   *
   * @param id Course id
   * @returns Likes count
   */
  public async getLikesCount(id: string | number): Promise<BigInt> {
    const likes = await this.Database.query().from('courses_likes').where('course_id', id).count('* as count');
    return likes[0].count;
  }

  /**
   * Get teacher of course
   *
   * @param id Course id
   * @returns User or null
   */
  public async getTeacher(id: string | number): Promise<User | null> {
    const course = await this.Course.query()
      .select('teacher_id')
      .preload('teacher', user => user.preload('contacts').preload('roles'))
      .where('id', id)
      .first();

    return course && course.teacher;
  }

  /**
   * Get category of course
   *
   * @param id Course id
   * @returns Category or null
   */
  public async getCategory(id: string | number): Promise<Category | null> {
    const course = await this.Course.query().select('category_id').preload('category').where('id', id).first();
    return course && course.category;
  }

  /**
   * Get lessons of course
   *
   * @param id Course id
   * @returns List of lessons or null
   */
  public async getLessons(id: string | number, userId: string): Promise<Lesson[] | null> {
    const course = await this.Course.query()
      .select('id')
      .preload('lessons', q =>
        q
          .preload('progress', p => p.where('user_id', userId))
          .preload('color')
          .orderBy('display_order', 'asc')
      )
      .where('id', id)
      .first();
    return course && course.lessons;
  }

  /**
   * Get students of course
   *
   * @param id Course id
   * @returns List of users or null
   */
  public async getStudents(id: string | number): Promise<User[] | null> {
    const course = await this.Course.query().preload('students').where('id', id).first();
    return course && course.students;
  }

  /**
   * Get count of students
   *
   * @param id Course if
   * @returns Students count
   */
  public async getStudentsCount(id: string | number): Promise<BigInt> {
    const students = await this.Database.query().from('users_courses').where('course_id', id).count('* as count');
    return students[0].count;
  }

  /**
   * Create course
   *
   * @param data Data input
   * @returns Created course
   */
  public async create(data: CreateCourseValidator['schema']['props']): Promise<Course> {
    /**
     * Create new course
     */
    const course = new this.Course();

    course.title = data.title;
    course.description = data.description;
    course.education_description = data.education_description;
    course.status = data.status;
    course.teacher_id = data.teacher_id;
    course.category_id = data.category_id;

    /**
     * Attach image
     */
    if (data.image) {
      course.image = Attachment.fromFile(data.image);
    }

    await course.save();

    return course;
  }

  /**
   * Delete course
   *
   * @param id Course id
   * @returns Deleted course
   */
  public async delete(id: string | number): Promise<Course | null> {
    const course = await this.Course.query()
      .preload('category')
      .withCount('students')
      .withCount('likes')
      .withCount('lessons')
      .where('id', id)
      .first();

    if (course) {
      await course.delete();
      return course;
    }

    return null;
  }

  /**
   * Update course
   *
   * @param id Course id
   * @param data Data to update
   * @returns Updated course or null
   */
  public async update(id: string | number, data: UpdateCourseValidator['schema']['props']): Promise<Course | null> {
    const course = await this.Course.query()
      .preload('teacher')
      .preload('category')
      .preload('lessons')
      .where('id', id)
      .first();

    if (course) {
      /**
       * Update fields
       */
      course.merge({
        title: data.title,
        description: data.description,
        education_description: data.education_description,
        teacher_id: data.teacher_id,
        category_id: data.category_id,
      });

      /**
       * Update image
       */
      if (data.image) {
        course.image = Attachment.fromFile(data.image);
      }

      /**
       * Load other updated data
       */
      await course.load('category');
      await course.load('teacher');

      await course.save();

      return course;
    }

    return null;
  }
}
