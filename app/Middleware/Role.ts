import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

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
  protected checkRoles(roles: string[], userRoles: string[]): void {
    if (!roles.some(role => userRoles.includes(role))) {
      /**
       * Failed to verify user rights
       */
      throw new Exception(this.error.message, this.error.status, this.error.code);
    }
  }

  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, roles: string[]) {
    const { userRoles } = auth.use('api').token?.meta;
    this.checkRoles(roles, userRoles);
    await next();
  }
}
