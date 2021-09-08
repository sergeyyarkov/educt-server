import { inject, Ioc } from '@adonisjs/core/build/standalone';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import ImageRepository from 'App/Repositories/ImageRepository';
import CreateImageValidator from 'App/Validators/Image/CreateImageValidator';

@inject()
export default class ImageService {
  private imageRepository: ImageRepository;

  constructor(imageRepository: ImageRepository) {
    this.imageRepository = imageRepository;
  }

  public async fetchImages(): Promise<IResponse> {
    const images = await this.imageRepository.getAll();

    return {
      success: true,
      message: 'Fetched all images.',
      status: HttpStatusEnum.OK,
      data: images,
    };
  }

  public async fetchImage(id: number): Promise<IResponse> {
    const image = await this.imageRepository.getById(id);

    if (!image) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Image not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      message: 'Fetched image.',
      status: HttpStatusEnum.OK,
      data: image,
    };
  }

  public async createImage(data: CreateImageValidator['schema']['props']): Promise<IResponse> {
    const image = await this.imageRepository.create(data.image);

    return {
      success: true,
      message: 'Image created.',
      status: HttpStatusEnum.OK,
      data: image,
    };
  }

  public async deleteImage(id: number): Promise<IResponse> {
    const image = await this.imageRepository.delete(id);

    if (!image) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Image not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      message: 'Image deleted.',
      status: HttpStatusEnum.OK,
      data: image,
    };
  }
}

new Ioc().make(ImageService);
