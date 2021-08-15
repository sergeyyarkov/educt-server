import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import CloudinaryService from 'App/Services/CloudinaryService';

export default class CloudinaryProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Adonis/Addons/Cloudinary', () => {
      const config = this.app.container.resolveBinding('Adonis/Core/Config').get('cloudinary', {});

      return new CloudinaryService(config);
    });
  }
}
