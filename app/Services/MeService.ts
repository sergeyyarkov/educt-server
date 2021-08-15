import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import Hash from '@ioc:Adonis/Core/Hash';
import Logger from '@ioc:Adonis/Core/Logger';
import StatusCodeEnum from 'App/Datatypes/Enums/StatusCodeEnum';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import ContactRepository from 'App/Repositories/ContactRepository';
import UserRepository from 'App/Repositories/UserRepository';
import UpdateContactsValidator from 'App/Validators/Contacts/UpdateContactsValidator';

@inject()
export default class MeService {
  private userRepository: UserRepository;

  private contactRepository: ContactRepository;

  private authGuard: 'api';

  constructor(userRepository: UserRepository, contactRepository: ContactRepository) {
    this.userRepository = userRepository;
    this.contactRepository = contactRepository;
  }

  /**
   * Get authorized user data
   *
   * @param auth AuthContract
   * @returns Response
   */
  public async fetchUserData(auth: AuthContract): Promise<IResponse> {
    const user = await auth.use(this.authGuard).authenticate();

    await user.load('roles');
    await user.load('contacts');
    await user.load('courses');

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'Fetched authorized user data.',
      data: user,
    };
  }

  /**
   * Change password of authorized user
   *
   * @param oldPassword Old password
   * @param newPassword New password
   * @param auth AuthContract
   * @returns Response
   */
  public async changeUserPassword(oldPassword: string, newPassword: string, auth: AuthContract): Promise<IResponse> {
    const user = await auth.use(this.authGuard).authenticate();

    /**
     * Verify old password
     */
    if (!(await Hash.verify(user.password, oldPassword))) {
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
     * Update password
     */
    const passwordUpdated = await this.userRepository.updatePassword(newPassword, user.id);

    if (passwordUpdated) {
      Logger.info(`Password of user with id: "${user.id}" was updated.`);

      return {
        success: true,
        status: StatusCodeEnum.OK,
        message: 'Password updated.',
        data: {},
      };
    }

    return {
      success: false,
      status: StatusCodeEnum.BAD_REQUEST,
      message: 'Unable to change password',
      data: {},
      error: {
        code: 'E_BAD_REQUEST',
      },
    };
  }

  /**
   * Update user conctact
   *
   * @param data Data to update
   * @param auth AuthContract
   * @returns Updated user contacts
   */
  public async updateUserContacts(
    data: UpdateContactsValidator['schema']['props'],
    auth: AuthContract
  ): Promise<IResponse> {
    const user = await auth.use(this.authGuard).authenticate();
    const contacts = await this.contactRepository.update(user, data);

    if (contacts) {
      return {
        success: true,
        status: StatusCodeEnum.OK,
        message: 'User contacts updated.',
        data: contacts,
      };
    }

    /**
     * Create user contacts if they don't exist
     */
    await this.contactRepository.create(user, data);

    return {
      success: true,
      status: StatusCodeEnum.OK,
      message: 'User contacts updated.',
      data: user.contacts,
    };
  }
}

new Ioc().make(MeService);
