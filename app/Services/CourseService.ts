import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Datatypes
 */
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';
import RoleHelper from 'App/Helpers/RoleHelper';

/**
 * Repositories
 */
import CourseRepository from 'App/Repositories/CourseRepository';
import UserRepository from 'App/Repositories/UserRepository';
import CategoryRepository from 'App/Repositories/CategoryRepository';

/**
 * Validators
 */
import CreateCourseValidator from 'App/Validators/Course/CreateCourseValidator';
import UpdateCourseValidator from 'App/Validators/Course/UpdateCourseValidator';
import FetchCoursesValidator from 'App/Validators/Course/FetchCoursesValidator';
import Course from 'App/Models/Course';
import Drive from '@ioc:Adonis/Core/Drive';
import CourseHelper, { FileEntry } from 'App/Helpers/CourseHelper';

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
  public async fetchCourses(params?: FetchCoursesValidator['schema']['props']): Promise<IResponse> {
    const data = await this.courseRepository.getAll(params);

    return {
      success: true,
      status: HttpStatusEnum.OK,
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
  public async fetchCourse(id: string | number): Promise<IResponse<Course | {}>> {
    const data = await this.courseRepository.getById(id);

    if (!data) {
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

    return {
      success: true,
      status: HttpStatusEnum.OK,
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
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
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
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
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
  public async fetchCourseLessons(id: string | number, ctx: HttpContextContract): Promise<IResponse> {
    const user = await ctx.auth.use('api').authenticate();
    const data = await this.courseRepository.getLessons(id, user.id);

    if (!data) {
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

    return {
      success: true,
      status: HttpStatusEnum.OK,
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
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched course students.',
      data,
    };
  }

  /**
   * Fetch students count by course id
   *
   * @param id Course id
   * @returns Response
   */
  public async fetchStudentsCount(id: string | number): Promise<IResponse> {
    const count = await this.courseRepository.getStudentsCount(id);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched students count.',
      data: { count },
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
    const user = await this.userRepository.getById(data.teacher_id);

    if (!user) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Teacher not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    const isHasPermissions = RoleHelper.userContainRoles(user.roles, [RoleEnum.ADMIN, RoleEnum.TEACHER]);

    if (!isHasPermissions) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: `User with id "${user.id}" does not have sufficient permissions.`,
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
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Category not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    /* Create course */
    const course = await this.courseRepository.create(data);

    return {
      success: true,
      status: HttpStatusEnum.CREATED,
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
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Course not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    await this.deleteAllFiles([course]);

    return {
      success: true,
      status: HttpStatusEnum.OK,
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
    const course = await this.courseRepository.getById(id);

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

    if (data.teacher_id) {
      const teacher = await this.userRepository.getById(data.teacher_id);

      if (!teacher) {
        return {
          success: false,
          status: HttpStatusEnum.NOT_FOUND,
          message: 'Teacher not found.',
          data: {},
          error: {
            code: 'E_NOT_FOUND',
          },
        };
      }

      await teacher.load('roles');

      const isTeacherOrAdmin = RoleHelper.userContainRoles(teacher.roles, [RoleEnum.ADMIN, RoleEnum.TEACHER]);

      if (!isTeacherOrAdmin) {
        return {
          success: false,
          status: HttpStatusEnum.BAD_REQUEST,
          message: 'Author is not a teacher or admin.',
          data: {},
          error: {
            code: 'E_BAD_REQUEST',
          },
        };
      }
    }

    const updated = await this.courseRepository.update(id, data);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Course updated.',
      data: updated || {},
    };
  }

  /**
   * Attach student to course
   *
   * @param id Course id
   * @param studentId Student id
   * @returns Response
   */
  public async attachUserCourse(id: string | number, studentId: string | number): Promise<IResponse> {
    const course = await this.courseRepository.getById(id);

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

    const student = await this.userRepository.getById(studentId);

    if (!student) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Student not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    const isStudent = RoleHelper.userHasRoles(student.roles, [RoleEnum.STUDENT]);

    if (!isStudent) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: `User cannot be added to the course without "${RoleEnum.STUDENT}" role.`,
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    try {
      await course.related('students').attach([student.id]);
    } catch (error) {
      if (error.code === '23505') {
        return {
          success: false,
          status: HttpStatusEnum.BAD_REQUEST,
          message: 'Student already attached to that course.',
          data: {},
          error: {
            code: 'E_BAD_REQUEST',
          },
        };
      }
      throw new Error(error);
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Student attached.',
      data: {},
    };
  }

  /**
   * Attach list of students from course
   *
   * @param id Course id
   * @param ids Student ids
   * @returns Response
   */
  public async attachStudentList(id: string | number, ids: Array<string>): Promise<IResponse> {
    const course = await this.courseRepository.getById(id);

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

    const students = await this.userRepository.getByIds(ids);

    try {
      await course.related('students').attach(students.map(s => s.id));
    } catch (error) {
      if (error.code === '23505') {
        return {
          success: false,
          status: HttpStatusEnum.BAD_REQUEST,
          message: 'Some student already attached to that course.',
          data: {},
          error: {
            code: 'E_BAD_REQUEST',
          },
        };
      }
      throw new Error(error);
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Student list successfully attached.',
      data: {},
    };
  }

  /**
   * Detach list of students from course
   *
   * @param id Course id
   * @param ids Student ids
   * @returns Response
   */
  public async detachStudentList(id: string | number, ids: Array<string>): Promise<IResponse> {
    const course = await this.courseRepository.getById(id);

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

    const students = await this.userRepository.getByIds(ids);

    try {
      await course.related('students').detach(students.map(s => s.id));
    } catch (error) {
      throw new Error(error);
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Student list successfully detached from course.',
      data: {},
    };
  }

  public async detachUserCourse(id: string | number, studentId: string | number): Promise<IResponse> {
    const course = await this.courseRepository.getById(id);

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

    const isAttached = course.students.find(student => student.id === studentId);

    if (!isAttached) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: 'Student not attached to that course.',
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    const student = await this.userRepository.getById(studentId);

    if (!student) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Student not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    await course.related('students').detach([student.id]);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Student detached.',
      data: {},
    };
  }

  public async attachUserLike(id: string | number, auth: AuthContract): Promise<any> {
    const user = await auth.use('api').authenticate();
    const course = await this.courseRepository.getById(id);

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

    try {
      await course.related('likes').attach([user.id]);
    } catch (error) {
      if (error.code === '23505') {
        return {
          success: false,
          status: HttpStatusEnum.BAD_REQUEST,
          message: 'You are already liked this course.',
          data: {},
          error: {
            code: 'E_BAD_REQUEST',
          },
        };
      }
      throw new Error(error);
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Like attached.',
      data: {},
    };
  }

  public async detachUserLike(id: string | number, auth: AuthContract): Promise<any> {
    const user = await auth.use('api').authenticate();
    const course = await this.courseRepository.getById(id);

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

    try {
      await course.related('likes').detach([user.id]);
    } catch (error) {
      throw new Error(error);
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Like detached.',
      data: {},
    };
  }

  public async setCourseStatus(id: string | number, status: CourseStatusEnum): Promise<IResponse> {
    const data = await this.courseRepository.setStatus(id, status);

    if (!data) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: `Cannot set status for course with id "${id}"`,
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Status changed.',
      data: {},
    };
  }

  public async fetchCourseLikesCount(id: string | number): Promise<IResponse> {
    const count = await this.courseRepository.getLikesCount(id);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched course likes count.',
      data: { count },
    };
  }

  /**
   * This function will delete all associated course files on disk
   *
   * @param courses List of courses
   */
  public async deleteAllFiles(courses: Course[]): Promise<void> {
    /**
     * Collect file names
     */
    const images = courses.map(course => CourseHelper.getImageFileName(course)).filter(Boolean) as FileEntry[];
    const videos = courses.flatMap(course => CourseHelper.getVideoFileNames(course)).filter(Boolean) as FileEntry[];
    const materials = courses.flatMap(course => CourseHelper.getMaterialFileNames(course));

    /**
     * Remove files from disk
     */
    const promises = videos
      .concat(images, materials)
      .map(file => Drive.delete(`${file.path}${file.name.substring(file.name.lastIndexOf('/') + 1)}`));

    await Promise.all(promises);
  }
}

new Ioc().make(CourseService);
