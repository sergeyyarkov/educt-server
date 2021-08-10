import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CoursesLikes extends BaseSchema {
  protected tableName = 'courses_likes';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');
      table.string('user_id', 21).unsigned().references('users.id').onDelete('CASCADE');
      table.string('course_id', 21).unsigned().references('courses.id').onDelete('CASCADE');
      table.timestamp('liked_on', { useTz: true });
      table.unique(['user_id', 'course_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
