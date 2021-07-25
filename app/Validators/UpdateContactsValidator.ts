import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateContactsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string.optional({}, [rules.email()]),
    phone_number: schema.string.optional({}, [
      rules.mobile({
        locales: ['ru-RU', 'en-US'],
        strict: true,
      }),
    ]),
    vk_id: schema.string.optional({}, [rules.regex(/^[a-zA-Z0-9_]+$/)]),
    twitter_id: schema.string.optional({}, [rules.regex(/^[a-zA-Z0-9_]+$/)]),
    telegram_id: schema.string.optional({}, [rules.regex(/^[a-zA-Z0-9_]+$/)]),
  });

  public messages = {};
}
