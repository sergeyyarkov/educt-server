import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { CourseFactory } from 'Database/factories';

export default class CourseSeeder extends BaseSeeder {
  private CourseFactory: typeof CourseFactory;

  public async run() {
    this.CourseFactory = CourseFactory;

    await this.CourseFactory.with('lessons', 10, lessonFactory => lessonFactory.with('content'))
      .with('category')
      .with('teacher')
      .createMany(3);
  }
}
