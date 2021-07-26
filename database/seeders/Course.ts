import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Category from 'App/Models/Category';
import Course from 'App/Models/Course';
import User from 'App/Models/User';

export default class CourseSeeder extends BaseSeeder {
  private Course: typeof Course;

  private User: typeof User;

  private Category: typeof Category;

  public async run() {
    this.Course = Course;
    this.User = User;
    this.Category = Category;

    const teacher = await this.User.findByOrFail('login', 'nikolai123');

    /**
     * Course 1
     */
    const category1 = await this.Category.findByOrFail('slug', 'javascript');
    const course1 = new this.Course();
    course1.title = 'Course 1';
    course1.description = 'Course 1 description';
    course1.teacher_id = teacher.id;
    course1.category_id = category1.id;
    await course1.save();

    /**
     * Course 2
     */
    const category2 = await this.Category.findByOrFail('slug', 'reactjs');
    const course2 = new this.Course();
    course2.title = 'Course 2';
    course2.description = 'Course 2 description';
    course2.teacher_id = teacher.id;
    course2.category_id = category2.id;
    await course2.save();

    /**
     * Course 3
     */
    const category3 = await this.Category.findByOrFail('slug', 'nodejs');
    const course3 = new this.Course();
    course3.title = 'Course 3';
    course3.description = 'Course 3 description';
    course3.teacher_id = teacher.id;
    course3.category_id = category3.id;
    await course3.save();
  }
}
