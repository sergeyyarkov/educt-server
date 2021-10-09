import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';

/**
 * Services
 */
import CategoryService from 'App/Services/CategoryService';

/**
 * Validatoes
 */
import CreateCategoryValidator from 'App/Validators/Category/CreateCategoryValidator';

import BaseController from '../../BaseController';

@inject()
export default class CategoriesController extends BaseController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    super();
    this.categoryService = categoryService;
  }

  /**
   * List of Categories
   * GET /categories
   */
  public async list(ctx: HttpContextContract) {
    const result = await this.categoryService.fetchCategories();

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Show category by id
   * GET /category/:id
   */
  public async show(ctx: HttpContextContract) {
    const result = await this.categoryService.fetchCategory(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Create new category
   * POST /categories/:id
   */
  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateCategoryValidator);
    const result = await this.categoryService.createCategory(payload);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Delete category by id
   * DELETE /categories/:id
   */
  public async delete(ctx: HttpContextContract) {
    const result = await this.categoryService.deleteCategory(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(CategoriesController);
