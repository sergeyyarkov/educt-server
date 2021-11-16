import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersRoles extends BaseSchema {
  protected tableName = 'users_roles';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id').primary();
      table.string('user_id', 21).unsigned().references('users.id').onDelete('CASCADE');
      table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE');
      table.unique(['user_id', 'role_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
