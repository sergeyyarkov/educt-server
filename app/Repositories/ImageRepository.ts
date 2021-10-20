import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
// import CloudinaryService from '@ioc:Adonis/Addons/Cloudinary';
import Drive from '@ioc:Adonis/Core/Drive';
import Image from 'App/Models/Image';

export default class ImageRepository {
  private Image: typeof Image;

  constructor() {
    this.Image = Image;
  }

  public async getById(id: number): Promise<Image | null> {
    const image = await this.Image.query().where('id', id).first();
    return image;
  }

  public async getByFileName(name: string): Promise<Image | null> {
    const image = await this.Image.query().where('name', name).first();
    return image;
  }

  public async getAll(): Promise<Image[]> {
    const images = await this.Image.query();
    return images;
  }

  public async create(file: MultipartFileContract): Promise<Image> {
    /**
     * Save image to disk
     */
    await file.moveToDisk('images/courses');

    /**
     * Save image to database
     */
    const image = await this.Image.create({ name: file.fileName, path: file.filePath, ext: file.extname });
    return image;
  }

  public async delete(id: number): Promise<Image | null> {
    const image = await this.Image.query().where('id', id).first();

    if (image) {
      /**
       * Delete from drive
       */
      await Drive.delete(image.path);

      /**
       * Delete from database
       */
      await image.delete();
      return image;
    }

    return null;
  }

  /**
   * Create image in cloudinary cloud
   *
   * @param file File
   * @param publicId Image public id
   * @returns Created image
   */
  // public async createInCloudinaryCloud(file: MultipartFileContract, publicId: string | undefined): Promise<Image> {
  //   const response = await CloudinaryService.upload(file, publicId);
  //   const image = await this.Image.create({ name: publicId, path: response.secure_url, ext: response.format });
  //   return image;
  // }

  /**
   * Delete image from cloudinary cloud
   *
   * @param id Image id
   * @returns Result or null
   */
  // public async deleteFormCloudinaryCloud(id: number): Promise<Image | null> {
  //   const image = await this.Image.query().where('id', id).first();

  //   if (image) {
  //     await CloudinaryService.destroy(image.name);
  //     await image.delete();
  //     return image;
  //   }

  //   return null;
  // }
}
