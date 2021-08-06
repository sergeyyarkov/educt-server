import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';

export default class DelRoleFromUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    roles: schema.array().members(schema.enum(Object.values(RoleEnum))),
  });

  public messages = {};
}
