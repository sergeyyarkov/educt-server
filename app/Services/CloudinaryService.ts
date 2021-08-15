import * as cloudinary from 'cloudinary';
import { UploadApiResponse, UploadApiOptions, ResponseCallback, ResourceType, DeliveryType } from 'cloudinary';
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import { CloudinaryConfig, CloudinaryInterface } from '@ioc:Adonis/Addons/Cloudinary';

export default class CloudinaryService implements CloudinaryInterface {
  private readonly config: CloudinaryConfig;

  private cloudinary: typeof cloudinary;

  constructor(config: CloudinaryConfig) {
    /**
     * Cloudinary config
     */
    cloudinary.v2.config({
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      cloud_name: config.cloudName,
      secure: config.secure,
    });

    this.cloudinary = cloudinary;
    this.config = config;
  }

  public async upload(
    file: MultipartFileContract,
    publicId: string | undefined = undefined,
    uploadOptions?: UploadApiOptions,
    callback?: ResponseCallback
  ): Promise<UploadApiResponse> {
    const path = CloudinaryService.getPathFromFile(file);
    const response = await this.cloudinary.v2.uploader.upload(
      path,
      { public_id: publicId, ...uploadOptions },
      callback
    );

    return response;
  }

  public async destroy(
    publicId: string,
    options?: {
      resource_type?: ResourceType;
      type?: DeliveryType;
      invalidate?: boolean;
    }
  ): Promise<any> {
    const response = await this.cloudinary.v2.uploader.destroy(publicId, options);
    return response;
  }

  public getConfig(): CloudinaryConfig {
    return this.config;
  }

  public static getPathFromFile(file: MultipartFileContract): string {
    const path = file.tmpPath ?? file.filePath;

    if (!path) {
      throw new Error('Cannot get file path from file');
    }

    return path;
  }
}
