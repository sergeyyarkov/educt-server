import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { CourseFactory } from 'Database/factories';

export default class CourseSeeder extends BaseSeeder {
  private CourseFactory: typeof CourseFactory;

  public async run() {
    this.CourseFactory = CourseFactory;

    const LESSONS_COUNT = 10;

    await this.CourseFactory.with('lessons', LESSONS_COUNT, lessonFactory =>
      lessonFactory
        .with('content')
        .merge(new Array(LESSONS_COUNT).fill(LESSONS_COUNT).map((_, i) => ({ display_order: i + 1 })))
    )
      .with('category')
      .with('teacher')
      .createMany(3);
  }
}
