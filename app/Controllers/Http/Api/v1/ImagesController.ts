import { Exception, inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ImageService from 'App/Services/ImageService';
import CreateImageValidator from 'App/Validators/Image/CreateImageValidator';
import BaseController from '../../BaseController';

@inject()
export default class ImagesController extends BaseController {
  private imageService: ImageService;

  constructor(imageService: ImageService) {
    super();
    this.imageService = imageService;
  }

  public async list(ctx: HttpContextContract) {
    const result = await this.imageService.fetchImages();

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  public async show(ctx: HttpContextContract) {
    const result = await this.imageService.fetchImage(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  public async create(ctx: HttpContextContract) {
    const payload = await ctx.request.validate(CreateImageValidator);
    const result = await this.imageService.createImage(payload);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }

  public async delete(ctx: HttpContextContract) {
    const result = await this.imageService.deleteImage(ctx.params.id);

    if (!result.success && result.error) {
      throw new Exception(result.message, result.status, result.error.code);
    }

    return this.sendResponse(ctx, result.data, result.message, result.status);
  }
}

new Ioc().make(ImagesController);
