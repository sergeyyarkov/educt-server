import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateContactsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    phone_number: schema.string.optional({}, [
      rules.mobile({
        locales: ['ru-RU', 'en-US'],
        strict: true,
      }),
    ]),
    vk_id: schema.string.optional({}, [rules.regex(/^([a-zA-Z0-9_]){1,64}$/)]),
    twitter_id: schema.string.optional({}, [rules.regex(/(^|[^@\w])@(\w{1,15})\b/)]),
    telegram_id: schema.string.optional({}, [rules.regex(/(^|[^@\w])@(\w{1,64})\b/)]),
  });

  public messages = {};
}
