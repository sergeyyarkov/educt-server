import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import ColorEnum from 'App/Datatypes/Enums/ColorEnum';

export default class Colors extends BaseSchema {
  protected tableName = 'colors';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id').primary();
      table
        .enu('name', Object.keys(ColorEnum), {
          useNative: true,
          enumName: 'color_name_enum',
          existingType: false,
          schemaName: 'public',
        })
        .notNullable();
      table.string('hex').notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
