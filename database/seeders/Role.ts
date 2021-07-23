/* eslint-disable class-methods-use-this */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Role from 'App/Models/Role';

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    await Role.createMany([
      {
        name: 'Administrator',
        slug: 'admin',
      },
      {
        name: 'Teacher',
        slug: 'teacher',
      },
      {
        name: 'Student',
        slug: 'student',
      },
    ]);
  }
}
