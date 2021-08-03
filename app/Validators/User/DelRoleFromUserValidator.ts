import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DelRoleFromUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    roles: schema.array().members(schema.string()),
  });

  public messages = {};
}
