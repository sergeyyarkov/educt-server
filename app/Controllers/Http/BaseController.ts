/* eslint-disable class-methods-use-this */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ResponseContract } from '@ioc:Adonis/Core/Response';
import Drive from '@ioc:Adonis/Core/Drive';
import { extname } from 'path';

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

  public sendStream(ctx: HttpContextContract, ...args: Parameters<ResponseContract['stream']>) {
    return ctx.response.stream(...args);
  }

  public sendFile(ctx: HttpContextContract, ...args: Parameters<ResponseContract['attachment']>) {
    return ctx.response.attachment(...args);
  }

  public async sendFileFromDrive(pathname: string, ctx: HttpContextContract) {
    /**
     * File not found
     */
    if (!(await Drive.exists(pathname))) return ctx.response.notFound();

    const { size } = await Drive.getStats(pathname);

    ctx.response.type(extname(pathname));
    ctx.response.header('content-length', size);

    const stream = await Drive.getStream(pathname);

    return this.sendStream(ctx, stream);
  }
}
