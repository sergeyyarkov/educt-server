import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Category from 'App/Models/Category';

export default class CategorySeeder extends BaseSeeder {
  private Category: typeof Category;

  public async run() {
    this.Category = Category;

    const category1 = new this.Category();
    category1.title = 'JavaScript';
    category1.slug = 'javascript';
    category1.description = 'Category 1 description';

    const category2 = new this.Category();
    category2.title = 'ReactJS';
    category2.slug = 'reactjs';
    category2.description = 'Category 2 description';

    const category3 = new this.Category();
    category3.title = 'NodeJS';
    category3.slug = 'nodejs';
    category3.description = 'Category 3 description';

    await category1.save();
    await category2.save();
    await category3.save();
  }
}
