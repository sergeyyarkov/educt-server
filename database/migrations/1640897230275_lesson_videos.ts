import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LessonVideos extends BaseSchema {
  protected tableName = 'lesson_videos';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');
      table.string('lesson_id', 21).unsigned().references('lessons.id').onDelete('CASCADE').notNullable();
      table.string('name').notNullable();
      table.integer('size').notNullable();
      table.string('client_name').notNullable();
      table.string('ext').notNullable();
      table.string('url').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
      table.unique(['lesson_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
