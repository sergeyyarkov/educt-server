import { inject, Ioc } from '@adonisjs/core/build/standalone';
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';

/**
 * Datatypes
 */
import StatusCodeEnum from 'App/Datatypes/Enums/StatusCodeEnum';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import RoleHelper from 'App/Helpers/RoleHelper';
import CategoryRepository from 'App/Repositories/CategoryRepository';

/**
 * Repositories
 */
import CourseRepository from 'App/Repositories/CourseRepository';
import UserRepository from 'App/Repositories/UserRepository';
import CreateCourseValidator from 'App/Validators/Course/CreateCourseValidator';
import UpdateCourseValidator from 'App/Validators/Course/UpdateCourseValidator';

@inject()
export default class CourseService {
  private courseRepository: CourseRepository;

  private userRepository: UserRepository;

  private categoryRepository: CategoryRepository;

  constructor(
    courseRepository: CourseRepository,
    userRepository: UserRepository,
    categoryRepository: CategoryRepository
  ) {
    this.courseRepository = courseRepository;
    this.userRepository = userRepository;
    this.categoryRepository = categoryRepository;
  }

  /**
   * Fetch list of courses
   *
   * @returns Response
   */
  public async fetchCourses(): Promise<IResponse> {
    const data = await this.courseRepository.getAll();

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Fetched all courses.',
      data,
    };
  }

  /**
   * Fetch one course by id
   *
   * @param id Course id
   * @returns Response
   */
  public async fetchCourse(id: string | number): Promise<IResponse> {
    const data = await this.courseRepository.getById(id);

    if (!data) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Fetched course.',
      data,
    };
  }

  /**
   * Fetch teacher by course id
   *
   * @param id Course id
   * @returns Response
   */
  public async fetchCourseTeacher(id: string | number): Promise<IResponse> {
    const data = await this.courseRepository.getTeacher(id);

    if (!data) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Fetched course teacher.',
      data,
    };
  }

  /**
   * Fetch category by course id
   *
   * @param id Course id
   * @returns Response
   */
  public async fetchCourseCategory(id: string | number): Promise<IResponse> {
    const data = await this.courseRepository.getCategory(id);

    if (!data) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Fetched course category.',
      data,
    };
  }

  /**
   * Fetch lessons by course id
   *
   * @param id Course id
   * @returns Response
   */
  public async fetchCourseLessons(id: string | number): Promise<IResponse> {
    const data = await this.courseRepository.getLessons(id);

    if (!data) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Fetched course lessons.',
      data,
    };
  }

  /**
   * Fetch students by course id
   *
   * @param id Course id
   * @returns Response
   */
  public async fetchCourseStudents(id: string | number): Promise<IResponse> {
    const data = await this.courseRepository.getStudents(id);

    if (!data) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Fetched course students.',
      data,
    };
  }

  /**
   * Create course
   *
   * @param data Data input
   * @returns Response
   */
  public async createCourse(data: CreateCourseValidator['schema']['props']): Promise<IResponse> {
    /**
     * Find course teacher
     */
    const teacher = await this.userRepository.getById(data.teacher_id);

    if (!teacher) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Teacher not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    const isTeacher = RoleHelper.userHasRoles(teacher.roles, [RoleEnum.TEACHER]);

    if (!isTeacher) {
      return {
        success: false,
        status: StatusCodeEnum.BAD_REQUEST,
        message: `User with id "${teacher.id}" not teacher.`,
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    /**
     * Find course category
     */
    const category = await this.categoryRepository.getById(data.category_id);

    if (!category) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Category not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    /**
     * Creating new course
     */
    const course = await this.courseRepository.create(data);

    return {
      success: true,
      status: StatusCodeEnum.CREATED,
      message: 'Course created.',
      data: course,
    };
  }

  /**
   * Delete course
   *
   * @param id Course id
   * @returns Response
   */
  public async deleteCourse(id: string | number): Promise<IResponse> {
    const course = await this.courseRepository.delete(id);

    if (!course) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Course deleted.',
      data: course,
    };
  }

  /**
   * Update course
   *
   * @param id Course id
   * @param data Data to update
   * @returns Response
   */
  public async updateCourse(id: string | number, data: UpdateCourseValidator['schema']['props']): Promise<IResponse> {
    const course = await this.courseRepository.update(id, data);

    if (!course) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Course updated.',
      data: course,
    };
  }
}

new Ioc().make(CourseService);