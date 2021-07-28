import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Role from 'App/Models/Role';

export default class RoleSeeder extends BaseSeeder {
  private Role: typeof Role;

  public async run() {
    this.Role = Role;

    await this.Role.createMany([
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
