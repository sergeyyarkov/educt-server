/* eslint-disable class-methods-use-this */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ResponseContract } from '@ioc:Adonis/Core/Response';

export default class BaseController {
  public sendResponse(ctx: HttpContextContract, data: object, message: string, status = 200, meta?: any): void {
    const response = {
      status,
      message,
      data,
      meta,
    };

    return ctx.response.status(response.status).send(response);
  }

  public sendFile(ctx: HttpContextContract, ...args: Parameters<ResponseContract['attachment']>) {
    return ctx.response.attachment(...args);
  }
}
