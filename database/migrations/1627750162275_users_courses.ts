import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersCourses extends BaseSchema {
  protected tableName = 'users_courses';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id').primary();
      table.string('user_id', 21).unsigned().references('users.id').onDelete('CASCADE');
      table.string('course_id', 21).unsigned().references('courses.id').onDelete('CASCADE');
      table.unique(['user_id', 'course_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
