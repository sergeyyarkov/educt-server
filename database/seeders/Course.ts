import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
import { CourseFactory } from 'Database/factories';

export default class CourseSeeder extends BaseSeeder {
  private User: typeof User;

  public async run() {
    this.User = User;

    const teacher = await this.User.query()
      .preload('roles', q => q.where('slug', 'teacher'))
      .firstOrFail();

    await (await CourseFactory.with('category').with('lessons', 3).create()).related('teacher').associate(teacher);
    await (await CourseFactory.with('category').with('lessons', 2).create()).related('teacher').associate(teacher);
    await (await CourseFactory.with('category').with('lessons', 1).create()).related('teacher').associate(teacher);
  }
}
