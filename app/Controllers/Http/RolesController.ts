import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Role from 'App/Models/Role';
import User from 'App/Models/User';
import AddRoleToUserValidator from 'App/Validators/AddRoleToUserValidator';

export default class RolesController {
  private readonly user: typeof User;

  private readonly role: typeof Role;

  constructor() {
    this.user = User;
    this.role = Role;
  }

  private async findRolesBySlug(input: any) {
    const roles = await this.role.query().whereIn('slug', input);

    if (roles.length !== input.length) {
      throw new Exception(
        'Unable to find any role using input value "roles"',
        404,
        'E_ROLE_NOT_FOUND'
      );
    }

    return roles;
  }

  /**
   * Add a role to a user by "id"
   * POST /user/:id/roles
   *
   * @param {HttpContextContract} context
   * @returns {Promise<User>} - Updated user.
   */
  public async store({ request, params }: HttpContextContract): Promise<Role[]> {
    try {
      await request.validate(AddRoleToUserValidator);

      const input = request.input('roles');
      const user = await this.user.findOrFail(params.id);
      const roles = await this.findRolesBySlug(input);

      await user.related('roles').attach(roles.map(r => r.id));
      await user.load('roles');

      return user.roles;
    } catch (error) {
      if (error.code === '23505') {
        throw new Exception('Some role already attached to that user.', 400, 'E_ROLE_ATTACHED');
      }
      throw error;
    }
  }

  /**
   * Detach role from user by "id"
   * DELETE /users/:id/roles
   *
   */
  public async destroy({ request, params }: HttpContextContract): Promise<Role[]> {
    const input = request.input('roles');
    const user = await this.user.query().preload('roles').where('id', params.id).firstOrFail();

    /**
     * Detach all when "roles" input not provided
     */
    if (input === undefined) {
      user.related('roles').detach([]);
      return [];
    }

    const roles = await this.findRolesBySlug(input);

    user.related('roles').detach(roles.map(r => r.id));
    await user.load('roles');

    return user.roles;
  }
}
