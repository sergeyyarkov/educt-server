import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateUserInfoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    about: schema.string.nullableAndOptional(),
    phone_number: schema.string.nullableAndOptional({}, [
      rules.mobile({ locales: ['ru-RU', 'en-US'], strict: true }),
      rules.unique({ table: 'contacts', column: 'phone_number' }),
    ]),
    vk_id: schema.string.nullableAndOptional({}, [rules.regex(/^([a-zA-Z0-9_]){1,64}$/)]),
    twitter_id: schema.string.nullableAndOptional({}, [rules.regex(/(^|[^@\w])@(\w{1,15})\b/)]),
    telegram_id: schema.string.nullableAndOptional({}, [rules.regex(/(^|[^@\w])@(\w{1,64})\b/)]),
  });

  public messages = {
    'phone_number.unique': 'This phone number is not available.',
  };
}
