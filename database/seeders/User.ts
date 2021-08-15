/* eslint-disable class-methods-use-this */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import { UserFactory } from 'Database/factories';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    /**
     * Get roles
     */
    const roles = {
      admin: await Role.findByOrFail('slug', 'admin'),
      teacher: await Role.findByOrFail('slug', 'teacher'),
      student: await Role.findByOrFail('slug', 'student'),
    };

    /**
     * Administrator
     */
    const userAdmin = await User.create({
      first_name: 'John',
      last_name: 'Doe',
      login: 'admin',
      password: '12345',
      email: 'example.email@mail.com',
    });
    await userAdmin.related('roles').attach([roles.admin.id]);

    /**
     * Teacher
     */
    const userTeacher = await UserFactory.with('contacts').create();
    await userTeacher.related('roles').attach([roles.teacher.id]);

    /**
     * Student
     */
    const userStudent = await UserFactory.with('contacts').create();
    await userStudent.related('roles').attach([roles.student.id]);
  }
}
