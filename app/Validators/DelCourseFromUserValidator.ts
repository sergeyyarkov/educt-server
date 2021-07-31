import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DelCourseFromUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    student_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
  });

  public messages = {};
}
