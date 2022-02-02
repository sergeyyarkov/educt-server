import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateUserInfoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    about: schema.string.optional(),
  });

  public messages = {};
}
