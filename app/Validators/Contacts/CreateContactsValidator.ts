import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateContactsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    phone_number: schema.string.nullableAndOptional({}, [
      rules.mobile({
        locales: ['ru-RU', 'en-US'],
        strict: true,
      }),
    ]),
    vk_id: schema.string.nullableAndOptional({}, [rules.regex(/^[a-zA-Z0-9_]+$/)]),
    twitter_id: schema.string.nullableAndOptional({}, [rules.regex(/^[a-zA-Z0-9_]+$/)]),
    telegram_id: schema.string.nullableAndOptional({}, [rules.regex(/^[a-zA-Z0-9_]+$/)]),
  });

  public messages = {};
}
