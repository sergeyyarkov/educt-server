import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ConversationType } from 'App/Store/MessageStore';
import IResponse from 'App/Datatypes/Interfaces/IResponse';

/**
 * Enums
 */
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';

/**
 * Services
 */
import WsService from 'App/Services/WsService';

import BaseController from '../../BaseController';

@inject()
export default class ChatController extends BaseController {
  /**
   * Get list of conversations (users)
   * GET /chat/conversations
   */
  public async getConversations(ctx: HttpContextContract) {
    const user = await ctx.auth.authenticate();
    const data = await WsService.messageStore.getConversations(user.id);
    const result: IResponse<ConversationType[]> = {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched conversations.',
      data,
    };

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(ChatController);
