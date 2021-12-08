import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

/**
 * Services
 */
import MeService from 'App/Services/MeService';

/**
 * Validators
 */
import ChangePasswordValidator from 'App/Validators/Password/ChangePasswordValidator';
import UpdateContactsValidator from 'App/Validators/Contacts/UpdateContactsValidator';

import BaseController from '../../BaseController';

@inject()
export default class MeController extends BaseController {
  private meService: MeService;

  constructor(meService: MeService) {
    super();
    this.meService = meService;
  }

  /**
   * Shows user info of the access token resource owner.
   * GET /me
   */
  public async show(ctx: HttpContextContract) {
    const result = await this.meService.fetchUserData(ctx.auth);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Change password of authenticated user
   * PATCH /me/password
   */
  public async changePassword(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(ChangePasswordValidator);
    const result = await this.meService.changeUserPassword(payload.oldPassword, payload.newPassword, ctx.auth);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Send confirmation code to new email
   * PATCH /me/email
   */
  public async changeEmail(ctx: HttpContextContract) {
    const payload = await ctx.request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      }),
      messages: {
        'email.unique': 'Email is not available.',
      },
    });
    const result = await MeService.changeUserEmail(payload.email);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Confirm code and update user email
   * POST /me/email/change/confirm
   */
  public async changeEmailConfirm(ctx: HttpContextContract) {
    const confirmChangeEmailSchema = schema.create({
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      confirmationCode: schema.number(),
    });
    const payload = await ctx.request.validate({ schema: confirmChangeEmailSchema });
    const result = await MeService.changeUserEmailConfirm(ctx, payload.email, payload.confirmationCode);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Update contacts of authenticated user
   * PATCH /me/contacts
   */
  public async updateContacts(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateContactsValidator);
    const result = await this.meService.updateUserContacts(payload, ctx.auth);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(MeController);
