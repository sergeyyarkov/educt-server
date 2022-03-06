import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class Role {
  error: {
    message: string;
    status: number;
    code: string;
  };

  constructor() {
    this.error = {
      message: 'You dont have permission to perform that action.',
      status: 403,
      code: 'E_ACCESS_DENIED',
    };
  }

  /**
   * Checks an array of roles for the current user
   * If the user role is not found in the array of roles for the route, an error is thrown
   *
   * @param {string[]} roles - Array of roles for route
   * @param {string[]} userRole - Array of roles of current user
   */
  protected check(roles: string[], userRoles: string[]): void {
    if (!roles.some(role => userRoles.includes(role))) {
      /**
       * Failed to verify user rights
       */
      throw new Exception(this.error.message, this.error.status, this.error.code);
    }
  }

  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, roles: string[]) {
    const { userId } = auth.use('api').token?.meta;
    const user = await User.query().where('id', userId).preload('roles').first();

    if (!user) {
      /**
       * User not found
       */
      throw new Exception('Cannot identify current user.', this.error.status, this.error.code);
    }

    this.check(
      roles,
      user.roles.map(role => role.slug)
    );
    await next();
  }
}
