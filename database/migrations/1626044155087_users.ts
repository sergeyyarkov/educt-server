import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.string('id', 21).primary().notNullable();
      table.string('name', 24).notNullable();
      table.string('surname', 24).notNullable();
      table.string('patronymic', 24).notNullable();
      table.string('login', 128).notNullable().unique();
      table.string('email', 254).notNullable().unique();
      table.string('password').notNullable();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
