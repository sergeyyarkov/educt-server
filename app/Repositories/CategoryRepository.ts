/**
 * Models
 */
import Category from 'App/Models/Category';

/**
 * Validators
 */
import CreateCategoryValidator from 'App/Validators/Category/CreateCategoryValidator';
import UpdateCategoryValidator from 'App/Validators/Category/UpdateCategoryValidator';

export default class CategoryRepository {
  private Category: typeof Category;

  constructor() {
    this.Category = Category;
  }

  /**
   * Get all categories
   *
   * @returns Array of categories
   */
  public async getAll(): Promise<Category[]> {
    const categories = await this.Category.query().preload('color');
    return categories;
  }

  /**
   * Get category by id
   *
   * @param id Category id
   * @returns Category or null
   */
  public async getById(id: string | number): Promise<Category | null> {
    const category = await this.Category.query().preload('color').where('id', id).first();
    return category;
  }

  /**
   * Create new category
   *
   * @param data Data input
   * @returns Created category
   */
  public async create(data: CreateCategoryValidator['schema']['props']): Promise<Category> {
    const category = await this.Category.create({
      title: data.title,
      description: data.description,
    });

    return category;
  }

  /**
   * Delete Category
   *
   * @param id Category id
   * @returns Deleted category or null
   */
  public async delete(id: string | number): Promise<Category | null> {
    const category = await this.Category.query().where('id', id).first();

    if (category) {
      await category.delete();
      return category;
    }

    return null;
  }

  /**
   * Update category by id
   *
   * @param id Category id
   * @param data
   * @returns
   */
  public async update(id: string | number, data: UpdateCategoryValidator['schema']['props']): Promise<Category | null> {
    const category = await this.Category.query().where('id', id).first();

    if (category) {
      await category.merge(data).save();
      return category;
    }

    return null;
  }
}
