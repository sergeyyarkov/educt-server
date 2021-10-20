import { inject, Ioc } from '@adonisjs/core/build/standalone';
import Application from '@ioc:Adonis/Core/Application';

/**
 * Datatypes
 */
import IResponse from 'App/Datatypes/Interfaces/IResponse';
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';

/**
 * Reposirories
 */
import ImageRepository from 'App/Repositories/ImageRepository';

@inject()
export default class AssetsService {
  private imageRepository: ImageRepository;

  constructor(imageRepository: ImageRepository) {
    this.imageRepository = imageRepository;
  }

  /**
   *
   * @param name Image name
   * @returns Pathname
   */
  public async getCourseImagePath(name: string): Promise<IResponse | string> {
    const image = await this.imageRepository.getByFileName(name);

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

    return Application.tmpPath(`uploads/images/courses/${image.name}`);
  }
}

new Ioc().make(AssetsService);
