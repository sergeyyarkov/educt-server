import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

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
    const result = await this.meService.fetchUserContacts(ctx.auth);

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
   * Update contacts of authenticated user
   * PUT /me/contacts
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
