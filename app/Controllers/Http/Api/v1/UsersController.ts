import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Services
 */
import UserService from 'App/Services/UserService';

/**
 * Validators
 */
import AddRoleToUserValidator from 'App/Validators/User/AddRoleToUserValidator';
import CreateUserValidator from 'App/Validators/User/CreateUserValidator';
import DelRoleFromUserValidator from 'App/Validators/User/DelRoleFromUserValidator';
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator';

import BaseController from '../../BaseController';

@inject()
export default class UsersController extends BaseController {
  private userService: UserService;

  constructor(userService: UserService) {
    super();
    this.userService = userService;
  }

  /**
   * Show a list of all users.
   * GET /users
   */

  public async list(ctx: HttpContextContract) {
    const result = await this.userService.fetchUsers(ctx.request.qs());

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status, result.meta);
  }

  /**
   * Show a current user by "id" parameter.
   * GET /users/:id
   */

  public async show(ctx: HttpContextContract) {
    const result = await this.userService.fetchUser(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Creates a new user in a system.
   * POST /users
   */

  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateUserValidator);
    const result = await this.userService.createUser(payload, ctx);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Update a user in a system by "id".
   * PATCH /users/:id
   */

  public async update(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(UpdateUserValidator);
    const result = await this.userService.updateUser(ctx.params.id, payload);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Delete a user by "id".
   * DELETE /users/:id
   */

  public async delete(ctx: HttpContextContract) {
    const result = await this.userService.deleteUser(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Attach array of roles to user
   * POST /users/:id/attach-roles
   */
  public async attachRoles(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(AddRoleToUserValidator);
    const result = await this.userService.attachRolesToUser(ctx.params.id, payload.roles);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  /**
   * Detach array of roles from user
   * DELETE /users/:id/detach-roles
   */
  public async detachRoles(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(DelRoleFromUserValidator);
    const result = await this.userService.detachRolesFromUser(ctx.params.id, payload.roles);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(UsersController);
