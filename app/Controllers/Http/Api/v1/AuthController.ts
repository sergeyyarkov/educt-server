import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import AuthService from 'App/Services/AuthService';

/**
 * Validators
 */
import AuthValidator from 'App/Validators/Auth/AuthValidator';

/**
 * Models
 */
import BaseController from '../../BaseController';

@inject()
export default class AuthController extends BaseController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  /**
   * Creates a new token for user and returns it.
   * POST /login
   */

  public async login(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(AuthValidator);
    const result = await this.authService.login(payload.login, payload.password, ctx.auth);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Revoke a token if user logged in.
   * POST /logout
   */

  public async logout(ctx: HttpContextContract) {
    const result = await this.authService.logout(ctx.auth);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(AuthController);
