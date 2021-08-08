/**
 * Models
 */
import Category from 'App/Models/Category';

export default class CategoryRepository {
  private Category: typeof Category;

  constructor() {
    this.Category = Category;
  }

  /**
   * Get category by id
   *
   * @param id Category id
   * @returns Caregory or null
   */
  public async getById(id: string | number): Promise<Category | null> {
    const category = await this.Category.query().where('id', id).first();
    return category;
  }
}
