import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    login: schema.string.optional({}, [rules.unique({ table: 'users', column: 'login' })]),
    email: schema.string.optional({}, [
      rules.email(),
      rules.unique({ table: 'contacts', column: 'email' }),
    ]),
    password: schema.string.optional(),
  });

  public messages = {};
}
