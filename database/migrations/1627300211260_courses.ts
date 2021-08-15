import BaseSchema from '@ioc:Adonis/Lucid/Schema';

/**
 * Datatypes
 */
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';

export default class Courses extends BaseSchema {
  protected tableName = 'courses';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.string('id', 21).primary();
      table.integer('bg_image_id').unsigned().references('images.id').onDelete('SET NULL');
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.string('teacher_id', 21).unsigned().references('users.id').onDelete('CASCADE');
      table.string('category_id', 21).unsigned().references('categories.id').onDelete('CASCADE');
      table
        .enu('status', Object.values(CourseStatusEnum), {
          useNative: true,
          enumName: 'course_status',
          existingType: false,
          schemaName: 'public',
        })
        .notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    await this.schema.raw('DROP TYPE IF EXISTS "course_status" CASCADE');
    this.schema.dropTable(this.tableName);
  }
}
