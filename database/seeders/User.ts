/* eslint-disable class-methods-use-this */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Role from 'App/Models/Role';
import User from 'App/Models/User';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    /**
     * Roles
     */
    const roles = {
      admin: await Role.findByOrFail('slug', 'admin'),
      teacher: await Role.findByOrFail('slug', 'teacher'),
      student: await Role.findByOrFail('slug', 'student'),
    };

    /**
     * Administrator
     */
    const user1 = new User();
    user1.first_name = 'Ivan';
    user1.last_name = 'Ivanov';
    user1.login = 'ivan123';
    user1.password = 'ivan123';

    await user1.save();
    await user1.related('roles').attach([roles.admin.id]);
    await user1.related('contacts').create({ email: 'ivan_ivanov@ya.ru' });

    /**
     * Teacher
     */
    const user2 = new User();
    user2.first_name = 'Nikolai';
    user2.last_name = 'Nikolaev';
    user2.login = 'nikolai123';
    user2.password = 'nikolai123';

    await user2.save();
    await user2.related('roles').attach([roles.teacher.id]);
    await user2.related('contacts').create({ email: 'nikolai_niko123@ya.ru' });

    /**
     * Student
     */
    const user3 = new User();
    user3.first_name = 'Oleg';
    user3.last_name = 'Olegov';
    user3.login = 'oleg123';
    user3.password = 'oleg123';

    await user3.save();
    await user3.related('roles').attach([roles.student.id]);
    await user3.related('contacts').create({ email: 'oleg_olegov123@ya.ru' });
  }
}
