import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LessonMaterials extends BaseSchema {
  protected tableName = 'lesson_materials';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id').primary();
      table.string('url').notNullable();
      table.string('name').notNullable();
      table.integer('size').notNullable();
      table.string('client_name').notNullable();
      table.string('ext').notNullable();
      table.string('lesson_id', 21).unsigned().references('lessons.id').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
