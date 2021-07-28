import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Contacts extends BaseSchema {
  protected tableName = 'contacts';

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id');
      table.string('user_id', 21).unsigned().references('users.id').unique().onDelete('CASCADE');
      table.string('email').unique().notNullable();
      table.string('phone_number').unique();
      table.string('vk_id').unique();
      table.string('twitter_id').unique();
      table.string('telegram_id').unique();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
