/* eslint-disable class-methods-use-this */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class BaseController {
  public sendResponse(ctx: HttpContextContract, data: object, message: string, status = 200): void {
    const response = {
      status,
      message,
      data,
    };

    return ctx.response.status(response.status).send(response);
  }
}
