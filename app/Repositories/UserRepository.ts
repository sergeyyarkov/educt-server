import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon';

/**
 * Models
 */
import User from 'App/Models/User';
import Role from 'App/Models/Role';

/**
 * Validators
 */
import CreateUserValidator from 'App/Validators/User/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator';
import UpdateUserInfoValidator from 'App/Validators/User/UpdateUserInfoValidator';

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

  public async getByIds(ids: Array<string>): Promise<Array<User>> {
    const data = await this.User.query().preload('contacts').preload('roles').whereIn('id', ids);
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
  public async getAll(params?: any) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { search, email, login, first_name, last_name, role, page, limit }: any = params || {};

    const query = this.User.query();

    if (email) {
      query.where('email', 'like', `%${email}%`);
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

    if (search) {
      query
        .orWhere('first_name', 'ilike', `%${search}%`)
        .orWhere('last_name', 'ilike', `%${search}%`)
        .orWhereRaw(`CONCAT(first_name, ' ', last_name) ilike ?`, [search])
        .orWhere('email', 'like', `${search}`)
        .orWhere('id', 'like', `${search}`);
    }

    if (role) {
      query.whereHas('roles', q => q.where('slug', role));
    }

    query.preload('contacts').preload('roles').orderBy('created_at', 'desc');

    /**
     * Return paginated users if provided params
     */
    if (limit && page) {
      const data = await query.paginate(page, limit);
      return data.toJSON();
    }

    /**
     * Return all users
     */
    const data = await query;
    return data;
  }

  /**
   * Create user
   *
   * @param data Data for create user
   * @returns Created user
   */
  public async create(data: CreateUserValidator['schema']['props']): Promise<User> {
    const user = await this.User.create({
      first_name: data.first_name.charAt(0).toUpperCase() + data.first_name.substr(1),
      last_name: data.last_name.charAt(0).toUpperCase() + data.last_name.substr(1),
      login: data.login,
      email: data.email,
      password: data.password,
    });

    await user.load('contacts');
    await user.load('roles');

    return user;
  }

  /**
   * Update user
   *
   * @param id User id
   * @param data Data to update
   * @returns User or null
   */
  public async update(id: number | string, data: UpdateUserValidator['schema']['props']): Promise<User | null> {
    const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();
    const { role, ...updatedFields } = data;

    if (user) {
      await user.merge(updatedFields).save();
      return user;
    }

    return null;
  }

  /**
   * Updates the time of last login column in database for user
   *
   * @param id User id
   */
  public async updateLastLogin(id: number | string) {
    await this.User.query().where('id', id).update({ last_login: DateTime.now() }).first();
  }

  /**
   * Update personal info of user
   *
   * @param data New fields
   */
  public async updateInfo(id: string | number, data: UpdateUserInfoValidator['schema']['props']) {
    const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();

    if (user) {
      await user.merge(data).save();
      return { about: user.about };
    }

    return null;
  }

  /**
   * Rewrite all user roles
   *
   * @param user User
   * @param roles Updated roles
   * @returns Updated user roles
   */
  // eslint-disable-next-line class-methods-use-this
  public async updateRoles(user: User, roles: Role[]): Promise<Role[]> {
    await user.related('roles').detach();
    await user.related('roles').attach(roles.map(role => role.id));
    await user.load('roles');

    return user.roles.map(role => role);
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
