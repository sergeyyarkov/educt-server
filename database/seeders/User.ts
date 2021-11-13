/* eslint-disable class-methods-use-this */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import { StudentFactory } from 'Database/factories';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    /**
     * Get roles
     */
    const roles = {
      admin: await Role.findByOrFail('slug', 'admin'),
      student: await Role.findByOrFail('slug', 'student'),
    };

    /**
     * Administrator
     */
    const userAdmin = await User.create({
      first_name: 'John',
      last_name: 'Doe',
      login: 'admin',
      password: '123456',
      email: 'administrator@example.com',
    });
    await userAdmin.related('roles').attach([roles.admin.id]);

    /**
     * Students
     */
    await StudentFactory.with('contacts').createMany(20);
  }
}
