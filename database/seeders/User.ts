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
      teacher: await Role.findByOrFail('slug', 'teacher'),
      student: await Role.findByOrFail('slug', 'student'),
    };

    /**
     * Administrator
     */
    const administrator = await User.create({
      first_name: 'John',
      last_name: 'Doe',
      login: 'admin',
      password: '123456',
      email: 'administrator@example.com',
    });
    await administrator.related('roles').attach([roles.admin.id]);

    /**
     * Teacher
     */
    const teacher = await User.create({
      first_name: 'Hanna',
      last_name: 'Liv',
      login: 'teacher',
      password: '123456',
      email: 'teacher@example.com',
    });
    await teacher.related('roles').attach([roles.teacher.id]);

    /**
     * Student
     */
    const student = await User.create({
      first_name: 'Ylfa',
      last_name: 'Erna',
      login: 'student',
      password: '123456',
      email: 'student@example.com',
    });
    await student.related('roles').attach([roles.student.id]);

    /**
     * Student list
     */
    await StudentFactory.with('contacts').createMany(20);
  }
}
