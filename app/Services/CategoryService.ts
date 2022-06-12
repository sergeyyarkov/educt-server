import { inject, Ioc } from '@adonisjs/core/build/standalone';

/**
 * Datatypes
 */
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';

/**
 * Repositories
 */
import CategoryRepository from 'App/Repositories/CategoryRepository';
import CourseRepository from 'App/Repositories/CourseRepository';

/**
 * Validators
 */
import CreateCategoryValidator from 'App/Validators/Category/CreateCategoryValidator';
import UpdateCategoryValidator from 'App/Validators/Category/UpdateCategoryValidator';

/**
 * Services
 */
import CourseService from 'App/Services/CourseService';

@inject()
export default class CategoryService {
  private categoryRepository: CategoryRepository;

  private courseRepository: CourseRepository;

  private courseService: CourseService;

  constructor(
    categoryRepository: CategoryRepository,
    courseRepository: CourseRepository,
    courseService: CourseService
  ) {
    this.categoryRepository = categoryRepository;
    this.courseRepository = courseRepository;
    this.courseService = courseService;
  }

  /**
   * Fetch list of categories
   *
   * @returns Response
   */
  public async fetchCategories(): Promise<IResponse> {
    const data = await this.categoryRepository.getAll();

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched all categories.',
      data,
    };
  }

  /**
   * Fetch category by id
   *
   * @param id Category id
   * @returns Response
   */
  public async fetchCategory(id: string | number): Promise<IResponse> {
    const data = await this.categoryRepository.getById(id);

    if (!data) {
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

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched category.',
      data,
    };
  }

  /**
   * Create new category
   *
   * @param data Data for create category
   * @returns Response
   */
  public async createCategory(data: CreateCategoryValidator['schema']['props']): Promise<IResponse> {
    const category = await this.categoryRepository.create(data);

    return {
      success: true,
      status: HttpStatusEnum.CREATED,
      message: 'Category created.',
      data: category,
    };
  }

  /**
   * Delete category by id
   *
   * @param id Category id
   * @returns Deleted category
   */
  public async deleteCategory(id: string | number): Promise<IResponse> {
    const data = await this.categoryRepository.getById(id);

    if (!data) {
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

    const courses = await this.courseRepository.getByCategoryId(id);
    await this.courseService.deleteAllFiles(courses);
    await this.categoryRepository.delete(id);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Category deleted.',
      data,
    };
  }

  /**
   * Update category
   *
   * @param id Category id
   * @returns Updated category
   */
  public async updateCategory(
    id: string | number,
    data: UpdateCategoryValidator['schema']['props']
  ): Promise<IResponse> {
    const category = await this.categoryRepository.update(id, data);

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

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Category updated.',
      data: category,
    };
  }
}

new Ioc().make(CategoryService);
