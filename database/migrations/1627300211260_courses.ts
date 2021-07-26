import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Courses extends BaseSchema {
  protected tableName = 'courses';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.string('id', 21).primary();
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.string('teacher_id', 21).unsigned().references('users.id').onDelete('CASCADE');
      table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
