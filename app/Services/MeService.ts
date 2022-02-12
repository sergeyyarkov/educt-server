import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Redis from '@ioc:Adonis/Addons/Redis';
import Mail from '@ioc:Adonis/Addons/Mail';
import Hash from '@ioc:Adonis/Core/Hash';
import Logger from '@ioc:Adonis/Core/Logger';

/**
 * Datatypes
 */
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import CodeErrorEnum from 'App/Datatypes/Enums/CodeErrorEnum';

/**
 * Repositories
 */
import ContactRepository from 'App/Repositories/ContactRepository';
import UserRepository from 'App/Repositories/UserRepository';

/**
 * Validator
 */
import UpdateUserInfoValidator from 'App/Validators/User/UpdateUserInfoValidator';
import UpdateContactsValidator from 'App/Validators/Contacts/UpdateContactsValidator';

/**
 * Helpers
 */
import RoleHelper from 'App/Helpers/RoleHelper';

/**
 * Services
 */
import Ws from './WsService';

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

    await user.load(loader => {
      loader
        .load('roles')
        .load('contacts')
        .load('likes', q => q.select('id'));
    });

    /**
     * Load available courses for STUDENT role
     */
    if (RoleHelper.userHasRoles(user.roles, [RoleEnum.STUDENT])) {
      await user.load('courses', q => {
        q.preload('category', loader => loader.preload('color'));
        q.withCount('students');
        q.withCount('likes');
        q.withCount('lessons');
      });
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
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
        status: HttpStatusEnum.UNAUTHORIZED,
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
        status: HttpStatusEnum.OK,
        message: 'Password updated.',
        data: {},
      };
    }

    return {
      success: false,
      status: HttpStatusEnum.BAD_REQUEST,
      message: 'Unable to change password',
      data: {},
      error: {
        code: 'E_BAD_REQUEST',
      },
    };
  }

  /**
   * Create new confirmation code and send to email
   *
   * @param email New email
   * @returns IResonse
   */
  public static async changeUserEmail(email: string): Promise<IResponse> {
    const isConfirmationCodeExist = await Redis.get(`code.change.email:${email}`);

    /**
     * Confirmation code has not expired
     */
    if (isConfirmationCodeExist) {
      return {
        success: false,
        status: HttpStatusEnum.SERVICE_UNAVAILABLE,
        message: 'Please wait a few seconds before send new confirmation code.',
        data: {},
        error: {
          code: CodeErrorEnum.CONFIRM_CODE_EXIST,
        },
      };
    }

    /**
     * Create new confirmation code and send to email
     */
    const EXPIRE_SECONDS = 120;
    const confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();

    /**
     * Try send an confirmation code on update email
     */
    try {
      await Mail.send(message => {
        message.to(email).subject('Confirmation code.').htmlView('emails/change_email_confirm', { confirmationCode });
      });
    } catch (error) {
      Logger.error(`Email send error: ${error}`);
      return {
        success: false,
        status: HttpStatusEnum.SERVICE_UNAVAILABLE,
        message: 'Unable send confirmation code.',
        data: {
          error,
        },
        error: {
          code: 'E_SERVICE_UNAVAILABLE',
        },
      };
    }

    /**
     * Create confirmation code value in redis store
     */
    await Redis.set(`code.change.email:${email}`, confirmationCode, 'EX', EXPIRE_SECONDS);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'The confirmation code has been sent.',
      data: {
        expired_seconds: EXPIRE_SECONDS,
      },
    };
  }

  /**
   * Compare confirmation code with payload
   * and update user email
   *
   * @param ctx Http context
   * @param email New email
   * @param code Confirmation code
   * @returns IResponse
   */
  public static async changeUserEmailConfirm(
    ctx: HttpContextContract,
    email: string,
    code: number
  ): Promise<IResponse> {
    const user = await ctx.auth.use('api').authenticate();
    const confirmationCode = await Redis.get(`code.change.email:${email}`);

    /**
     * Confirmation code not found
     */
    if (confirmationCode === null) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Cannot find the confirmation code for this email.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    /**
     * Return error if confirmation code is invalid
     */
    if (Number.parseInt(confirmationCode, 10) !== code) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: 'Confirmation code is invalid.',
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    /**
     * Update user email and delete confirmation code
     */
    await user.merge({ email }).save();
    await Redis.del(`code.change.email:${email}`);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'User email updated.',
      data: { email },
    };
  }

  /**
   * Update user conctact
   *
   * @param data Fields to update
   * @param auth AuthContract
   * @returns IResponse
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
        status: HttpStatusEnum.OK,
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
      status: HttpStatusEnum.OK,
      message: 'User contacts updated.',
      data: user.contacts,
    };
  }

  /**
   * Update info about user
   *
   * @param data Fields to update
   * @param auth AuthContract
   * @returns IResponse
   */
  public async updateUserInfo(
    data: UpdateUserInfoValidator['schema']['props'],
    auth: AuthContract
  ): Promise<IResponse> {
    const user = await auth.use(this.authGuard).authenticate();

    if (Object.keys(data).length === 0) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: 'You must specify at least one field.',
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    /**
     * Personal info updating
     */
    if (data.about !== undefined) {
      await this.userRepository.updateInfo(user.id, data);
    }

    /**
     * Contacts updating
     */
    if (data.phone_number !== undefined || data.twitter_id !== undefined || data.telegram_id !== undefined) {
      const contacts = await this.contactRepository.update(user, {
        phone_number: data.phone_number,
        twitter_id: data.twitter_id,
        telegram_id: data.telegram_id,
        vk_id: data.vk_id,
      });

      if (!contacts) {
        await this.contactRepository.create(user, data);
      }
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'User contacts updated.',
      data: { ...data },
    };
  }

  /**
   * Fetch history of chat
   *
   * @param chatId Id of user
   * @param auth AuthContract
   * @returns IResponse
   */
  public async fetchChatHistory(chatId: string, auth: AuthContract): Promise<IResponse> {
    const firstUser = await auth.use(this.authGuard).authenticate();
    const secondUser = await this.userRepository.getById(chatId);

    if (!secondUser) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Chat not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    const history = await Ws.messageStore.getHistory(firstUser.id, secondUser.id);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Chat history fetched.',
      data: {
        history,
      },
    };
  }
}

new Ioc().make(MeService);
