declare module '@ioc:Adonis/Addons/Cloudinary' {
  import {
    ResponseCallback,
    TransformationOptions,
    UploadApiOptions,
    UploadApiResponse,
    ResourceType,
    DeliveryType,
  } from 'cloudinary';
  import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';

  export interface CloudinaryConfig {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    secure: boolean;
    [key: string]: TransformationOptions;
  }

  export interface CloudinaryInterface {
    upload(
      file: MultipartFileContract,
      publicId: string | undefined,
      uploadOptions?: UploadApiOptions,
      callback?: ResponseCallback
    ): Promise<UploadApiResponse>;

    destroy(
      publicId: string,
      options?: {
        resource_type?: ResourceType;
        type?: DeliveryType;
        invalidate?: boolean;
      }
    ): Promise<any>;

    getConfig(): CloudinaryConfig;
  }

  const CloudinaryService: CloudinaryInterface;
  export default CloudinaryService;
}