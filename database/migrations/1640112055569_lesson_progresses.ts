import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LessonProgresses extends BaseSchema {
  protected tableName = 'lesson_progresses';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');
      table.string('user_id', 21).unsigned().references('users.id').onDelete('CASCADE');
      table.string('lesson_id', 21).unsigned().references('lessons.id').onDelete('CASCADE');
      table.boolean('is_watched').notNullable();
      table.unique(['user_id', 'lesson_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
