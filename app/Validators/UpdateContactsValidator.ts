import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateContactsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string.optional({}, [rules.email(), rules.unique({ table: 'contacts', column: 'email' })]),
    phone_number: schema.string.optional(),
    vk_id: schema.string.optional(),
    twitter_id: schema.string.optional(),
    telegram_id: schema.string.optional(),
  });

  public messages = {};
}
