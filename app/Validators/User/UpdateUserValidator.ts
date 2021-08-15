import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string(),
    last_name: schema.string(),
    login: schema.string.optional({}, [rules.unique({ table: 'users', column: 'login' })]),
    email: schema.string.optional({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string(),
  });

  public messages = {};
}
