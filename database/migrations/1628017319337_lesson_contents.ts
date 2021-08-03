import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LessonContents extends BaseSchema {
  protected tableName = 'lesson_contents';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');
      table.string('lesson_id', 21).unsigned().references('lessons.id').unique().onDelete('CASCADE');
      table.string('video_url').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
