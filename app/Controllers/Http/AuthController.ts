import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import Hash from '@ioc:Adonis/Core/Hash';
import User from 'App/Models/User';
import { Exception } from '@adonisjs/core/build/standalone';

export default class AuthController {
  private user: typeof User;

  private guard: 'api';

  constructor() {
    this.user = User;
  }

  /**
   * Creates a new token for user and returns it.
   * POST /login
   */

  public async login({ auth, request }: HttpContextContract) {
    const login = request.input('login');
    const password = request.input('password');
    const user = await this.user.query().preload('roles').where('login', login).firstOrFail();

    if (!(await Hash.verify(user.password, password))) {
      throw new Exception('Invalid credentials.', 403, 'E_INVALID_CREDENTIALS');
    }

    const token = await auth.use(this.guard).generate(user, {
      expiresIn: '1d',
      userRoles: user.roles.map(role => role.slug),
    });

    Logger.info(`A token for user with id: "${token.user.id}" was successfully generated.`);

    return token.toJSON();
  }

  /**
   * Revoke a token if user logged in.
   * POST /logout
   */

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use(this.guard).revoke();
    return response.noContent();
  }
}
