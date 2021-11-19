import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Lessons extends BaseSchema {
  protected tableName = 'lessons';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.string('id', 21).primary();
      table.string('course_id', 21).unsigned().references('courses.id').onDelete('CASCADE');
      table.string('title').notNullable();
      table.integer('color_id').unsigned().references('colors.id');
      table.string('description');
      table.time('duration').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
