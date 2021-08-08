/* eslint-disable @typescript-eslint/naming-convention */

import Hash from '@ioc:Adonis/Core/Hash';

/**
 * Models
 */
import User from 'App/Models/User';

/**
 * Validators
 */
import CreateUserValidator from 'App/Validators/User/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator';

export default class UserRepository {
  private User: typeof User;

  constructor() {
    this.User = User;
  }

  /**
   * Get user by id
   *
   * @param id User id
   * @returns User or null
   */
  public async getById(id: string | number): Promise<User | null> {
    const data = await this.User.query().preload('contacts').preload('roles').where('id', id).first();
    return data;
  }

  /**
   * Get user by column
   *
   * @param column Column name
   * @param value Comparsion column
   * @returns User or null
   */
  public async getByColumn(column: string, value: string | number): Promise<User | null> {
    const data = await this.User.query().preload('contacts').preload('roles').where(column, value).first();
    return data;
  }

  /**
   * Get users by role
   *
   * @param role Role
   * @returns Array of users with role
   */
  public async getAllByRole(role: string): Promise<User[]> {
    const data = await this.User.query()
      .preload('contacts')
      .preload('roles')
      .whereHas('roles', q => q.where('slug', role));
    return data;
  }

  /**
   * Get list users
   *
   * @param params Params to find
   * @returns Array of users
   */
  public async getAll(params?: any): Promise<User[]> {
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

  /**
   * Create user
   *
   * @param data Data for create user
   * @returns Created user
   */
  public async create(data: CreateUserValidator['schema']['props']): Promise<User> {
    const createdUser = await this.User.create(data);

    await createdUser.load('contacts');
    await createdUser.load('roles');

    return createdUser;
  }

  /**
   * Update user
   *
   * @param id User id
   * @param data Data to update
   * @returns User or null if user is not found
   */
  public async update(id: number | string, data: UpdateUserValidator['schema']['props']): Promise<User | null> {
    const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();

    if (user) {
      await user.merge(data).save();
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
  public async delete(id: number | string): Promise<User | null> {
    const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();

    if (user) {
      await user.delete();
      return user;
    }

    return null;
  }

  public async updatePassword(password: string, id: string | number): Promise<any> {
    const hashedPass = await Hash.make(password);
    return this.User.query().where('id', id).update({ password: hashedPass }).first();
  }
}
