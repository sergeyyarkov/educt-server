import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Images extends BaseSchema {
  protected tableName = 'images';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');
      table.string('path').notNullable();
      table.string('name').notNullable();
      table.string('ext').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
