import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Course from 'App/Models/Course';
import User from 'App/Models/User';
import { CourseFactory } from 'Database/factories';

export default class CourseSeeder extends BaseSeeder {
  private User: typeof User;

  public async run() {
    this.User = User;

    const teacher = await this.User.query()
      .preload('roles')
      .whereHas('roles', q => q.where('slug', 'teacher'))
      .firstOrFail();

    await CourseFactory.with('category')
      .with('lessons', 2, lessonFactory => lessonFactory.with('content'))
      .createMany(3, (course: Course) => course.related('teacher').associate(teacher));
  }
}
