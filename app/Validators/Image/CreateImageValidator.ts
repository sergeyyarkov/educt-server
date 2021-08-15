import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateImageValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    image: schema.file({
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  });

  public messages = {};
}
