/* eslint-disable @typescript-eslint/naming-convention */
import User from 'App/Models/User';
import CreateUserValidator from 'App/Validators/User/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator';

export default class UserRepository {
  private User: typeof User;

  constructor() {
    this.User = User;
  }

  public async getById(id: string | number) {
    const data = await this.User.query().preload('contacts').preload('roles').where('id', id).first();
    return data;
  }

  public async getAllByRole(role: string) {
    const data = await this.User.query()
      .preload('contacts')
      .preload('roles')
      .whereHas('roles', q => q.where('slug', role));
    return data;
  }

  public async getAll(params?: any) {
    const { email, login, first_name, last_name, role }: any = params || {};
    const query = this.User.query();

    if (email) {
      query.preload('contacts').whereHas('contacts', q => q.where('email', 'like', `%${email}%`));
    }

    if (login) {
      query.where('login', 'like', `%${login}%`);
    }

    if (first_name) {
      query.where('first_name', 'like', `%${first_name}%`);
    }

    if (last_name) {
      query.where('last_name', 'like', `%${last_name}%`);
    }

    if (role) {
      query.preload('roles').whereHas('roles', q => q.where('slug', role));
    }

    const data = await query.preload('contacts').preload('roles');
    return data;
  }

  public async create(data: CreateUserValidator['schema']['props']) {
    const createdUser = await this.User.create({
      first_name: data.first_name,
      last_name: data.last_name,
      login: data.login,
      password: data.password,
    });

    return createdUser;
  }

  /**
   * Update user
   *
   * @param id User id
   * @param data Data to update
   * @returns User or null if user is not found
   */
  public async update(id: number | string, data: UpdateUserValidator['schema']['props']) {
    const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();

    if (user) {
      await user
        .merge({
          first_name: data.first_name,
          last_name: data.last_name,
          login: data.login,
          password: data.password,
        })
        .save();
      return user;
    }

    return null;
  }

  /**
   * Delete user
   *
   * @param id User id
   * @returns Deleted user or null if user is not found
   */
  public async delete(id: number | string) {
    const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();

    if (user) {
      await user.delete();
      return user;
    }

    return null;
  }
}
