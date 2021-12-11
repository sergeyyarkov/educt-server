import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DetachStudentstValitator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    students: schema.array().members(schema.string({}, [rules.exists({ table: 'users', column: 'id' })])),
  });

  public messages = {};
}
