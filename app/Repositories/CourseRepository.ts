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
import UpdateCourseValidator from 'App/Validators/Course/UpdateCourseValidator';

export default class CourseRepository {
  private Course: typeof Course;

  constructor() {
    this.Course = Course;
  }

  /**
   * Get all courses
   *
   * @returns List of courses
   */
  public async getAll(): Promise<Course[]> {
    const courses = await this.Course.query().preload('teacher').preload('category').preload('lessons');
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
      .preload('category')
      .preload('lessons')
      .where('id', id)
      .first();

    return course;
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
  public async getLessons(id: string | number): Promise<Lesson[] | null> {
    const course = await this.Course.query().select('id').preload('lessons').where('id', id).first();
    return course && course.lessons;
  }

  /**
   * Get students of cours
   *
   * @param id Course id
   * @returns List of users or null
   */
  public async getStudents(id: string | number): Promise<User[] | null> {
    const course = await this.Course.query().preload('students').where('id', id).first();
    return course && course.students;
  }

  /**
   * Create course
   *
   * @param data Data input
   * @returns Created course
   */
  public async create(data: CreateCourseValidator['schema']['props']): Promise<Course> {
    const createdCourse = await this.Course.create(data);
    return createdCourse;
  }

  /**
   * Delete course
   *
   * @param id Course id
   * @returns Deleted course
   */
  public async delete(id: string | number): Promise<Course | null> {
    const course = await this.Course.query()
      .preload('teacher')
      .preload('category')
      .preload('lessons')
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
   * @returns Updated course
   */
  public async update(id: string | number, data: UpdateCourseValidator['schema']['props']): Promise<Course | null> {
    const course = await this.Course.query()
      .preload('teacher')
      .preload('category')
      .preload('lessons')
      .where('id', id)
      .first();

    if (course) {
      await course.merge(data).save();
      return course;
    }

    return null;
  }
}
