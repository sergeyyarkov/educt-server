import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
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

  public async create({ file, location }: { file: MultipartFileContract; location: string }): Promise<Image> {
    /**
     * Save image to disk
     */
    await file.moveToDisk(location);

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
}
