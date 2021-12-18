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
      table.json('image');
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.string('education_description', 250);
      table.string('teacher_id', 21).unsigned().references('users.id').notNullable().onDelete('CASCADE');
      table.string('category_id', 21).unsigned().references('categories.id').notNullable().onDelete('CASCADE');
      table.integer('color_id').unsigned().references('colors.id');
      table
        .enu('status', Object.values(CourseStatusEnum), {
          useNative: true,
          enumName: 'course_status_enum',
          existingType: false,
          schemaName: 'public',
        })
        .notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    await this.schema.raw('DROP TYPE IF EXISTS "course_status_enum" CASCADE');
    this.schema.dropTable(this.tableName);
  }
}
