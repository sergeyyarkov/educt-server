import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';

/**
 * Datatypes
 */
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';

/**
 * Reposirories
 */
import UserRepository from 'App/Repositories/UserRepository';

@inject()
export default class AuthService {
  private userRepository: UserRepository;

  private authGuard: 'api';

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Login user
   *
   * @param login Login
   * @param password Password
   * @param ctx Http context
   * @returns Token data
   */
  public async login(login: string, password: string, ctx: HttpContextContract): Promise<IResponse> {
    const user = await this.userRepository.getByColumn('login', login);

    if (!user) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'User not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    /**
     * Invalid credentials while login
     */
    if (!(await Hash.verify(user.password, password))) {
      return {
        success: false,
        status: HttpStatusEnum.UNAUTHORIZED,
        message: 'Invalid credentials.',
        data: {},
        error: {
          code: 'E_INVALID_CREDENTIALS',
        },
      };
    }

    /**
     * Create new token
     */
    const token = await ctx.auth.use(this.authGuard).generate(user, {
      expiresIn: '1d',
      userRoles: user.roles.map(role => role.slug),
      userName: user.fullname,
    });

    ctx.response.cookie('token', token.token);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Login success.',
      data: {
        userId: user.id,
        ...token.toJSON(),
      },
    };
  }

  /**
   * Logout user
   *
   * @param ctx Http context
   * @returns Logout message
   */
  public async logout(ctx: HttpContextContract): Promise<IResponse> {
    ctx.response.clearCookie('token');
    await ctx.auth.use(this.authGuard).revoke();

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Logout success.',
      data: {},
    };
  }
}

new Ioc().make(AuthService);
