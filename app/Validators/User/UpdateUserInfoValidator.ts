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
    vk_id: schema.string.nullableAndOptional({}, [
      rules.regex(/^([a-zA-Z0-9_]){1,64}$/),
      rules.unique({ table: 'contacts', column: 'vk_id' }),
    ]),
    twitter_id: schema.string.nullableAndOptional({}, [
      rules.regex(/(^|[^@\w])@(\w{1,15})\b/),
      rules.unique({ table: 'contacts', column: 'twitter_id' }),
    ]),
    telegram_id: schema.string.nullableAndOptional({}, [
      rules.regex(/(^|[^@\w])@(\w{1,64})\b/),
      rules.unique({ table: 'contacts', column: 'telegram_id' }),
    ]),
  });

  public messages = {
    'phone_number.unique': 'This phone number is not available.',
    'vk_id.unique': 'This ID is not available.',
    'twitter_id.unique': 'Twitter username is not available.',
    'telegram_id.unique': 'Telegram username is not available.',
  };
}
