import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    about: schema.string.optional(),
    login: schema.string.optional({}, [rules.unique({ table: 'users', column: 'login' })]),
    email: schema.string.optional({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string.optional(),
    role: schema.enum.optional(Object.values(RoleEnum)),
  });

  public messages = {
    'login.unique': '"Login" filed is already in use.',
    'email.unique': '"Email" field is already in use.',
  };
}
