import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Models
 */
import Role from 'App/Models/Role';
import User from 'App/Models/User';

/**
 * Validators
 */
import AddRoleToUserValidator from 'App/Validators/AddRoleToUserValidator';
import CreateUserValidator from 'App/Validators/CreateUserValidator';
import DelRoleFromUserValidator from 'App/Validators/DelRoleFromUserValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UsersController {
  private readonly User: typeof User;

  private readonly Role: typeof Role;

  constructor() {
    this.User = User;
    this.Role = Role;
  }

  /**
   * Show a list of all users.
   * GET /users
   */

  public async list({ response }: HttpContextContract) {
    const users = await this.User.query().preload('contacts').preload('roles');

    return response.ok({
      message: 'Fetched all users.',
      data: users,
    });
  }

  /**
   * Show a current user by "id" parameter.
   * GET /users/:id
   */

  public async show({ response, params }: HttpContextContract) {
    const user = await this.User.findOrFail(params.id);

    await user.load('contacts');
    await user.load('roles');

    return response.ok({
      message: `Fetched user with id: "${user.id}"`,
      data: user,
    });
  }

  /**
   * Creates a new user in a system.
   * POST /users
   */

  public async create({ response, request }: HttpContextContract) {
    await request.validate(CreateUserValidator);

    const user = await this.User.create({
      first_name: request.input('first_name'),
      last_name: request.input('last_name'),
      login: request.input('login'),
      password: request.input('password'),
    });

    await user.related('contacts').create({ email: request.input('email') });
    await user.load('contacts');

    return response.created({ message: 'Successfully created.', data: user });
  }

  /**
   * Update a user in a system by "id".
   * PATCH /users/:id
   */

  public async update({ request, response, params }: HttpContextContract) {
    await request.validate(UpdateUserValidator);

    const user = await this.User.findOrFail(params.id);
    const input: Pick<User, 'first_name' | 'last_name' | 'login' | 'password'> = {
      first_name: request.input('first_name'),
      last_name: request.input('last_name'),
      login: request.input('login'),
      password: request.input('password'),
    };

    /**
     * Update roles
     */
    Object.keys(input).forEach(k => {
      if (input[k] !== undefined) {
        user[k] = input[k];
      }
    });

    await user.save();
    await user.load('roles');
    await user.load('contacts');

    return response.ok({
      message: `User with id: "${user.id}" was successfully updated.`,
      data: user,
    });
  }

  /**
   * Delete a user by "id".
   * DELETE /users/:id
   */

  public async delete({ response, params }: HttpContextContract) {
    const user = await this.User.query().preload('contacts').preload('roles').where('id', params.id).firstOrFail();

    await user.delete();

    return response.ok({
      message: `Used with id: "${user.id}" was successfully deleted.`,
      data: user,
    });
  }

  /**
   * Attach array of roles to user
   * POST /users/:id/attach-roles
   */
  public async attachRoles({ request, response, params }: HttpContextContract) {
    await request.validate(AddRoleToUserValidator);

    const input: string[] | undefined = request.input('roles');
    const user = await this.User.query().preload('roles').where('id', params.id).firstOrFail();
    const roles = await this.findRolesBySlug(input);

    await this.User.attachRoles(user, roles);

    return response.ok({
      message: 'Roles attached',
      data: user.roles,
    });
  }

  /**
   * Detach array of roles from user
   * DELETE /users/:id/detach-roles
   */
  public async detachRoles({ request, response, params }: HttpContextContract) {
    await request.validate(DelRoleFromUserValidator);

    const input: string[] | undefined = request.input('roles');
    const user = await this.User.query().preload('roles').where('id', params.id).firstOrFail();
    const roles = await this.findRolesBySlug(input);

    await this.User.detachRoles(user, roles);

    return response.ok({
      message: 'Roles detached',
      data: user.roles,
    });
  }

  /**
   * Finds roles by input value and throw error if role does not exist.
   *
   * @param input Array of roles to find them
   * @returns Finded roles
   */
  private async findRolesBySlug(input: string[] | undefined): Promise<Role[]> {
    if (!input) {
      throw new Exception('Unable to find "roles" field in input.', 400, 'E_ROLES_FIELD_NOT_PROVIDED');
    }

    const roles = await this.Role.query().whereIn('slug', input);

    input.forEach(val => {
      if (!roles.map(r => r.slug).includes(val)) {
        throw new Exception(`Unable to find role: "${val}" using input value "roles"`, 404, 'E_ROLE_NOT_FOUND');
      }
    });

    return roles;
  }
}
