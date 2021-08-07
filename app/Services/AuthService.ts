import { inject, Ioc } from '@adonisjs/core/build/standalone';
import Hash from '@ioc:Adonis/Core/Hash';
import Logger from '@ioc:Adonis/Core/Logger';

/**
 * Interfaces
 */
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import IResponse from 'App/Datatypes/Interfaces/IResponse';

/**
 * Enums
 */
import StatusCodeEnum from 'App/Datatypes/Enums/StatusCodeEnum';

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
   * @param auth AuthContact
   * @returns Token data
   */
  public async login(login: string, password: string, auth: AuthContract): Promise<IResponse> {
    const user = await this.userRepository.getByColumn('login', login);

    if (!user) {
      return {
        success: false,
        status: StatusCodeEnum.NOT_FOUND,
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
        status: StatusCodeEnum.UNAUTHORIZED,
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
    const token = await auth.use(this.authGuard).generate(user, {
      expiresIn: '1d',
      userRoles: user.roles.map(role => role.slug),
    });

    Logger.info(`A token for user with id: "${token.user.id}" was successfully generated.`);

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Login success.',
      data: token.toJSON(),
    };
  }

  /**
   * Logout user
   *
   * @param auth AuthContract
   * @returns Logout message
   */
  public async logout(auth: AuthContract): Promise<IResponse> {
    await auth.use(this.authGuard).revoke();

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Logout success.',
      data: {},
    };
  }
}

new Ioc().make(AuthService);
