import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateLessonValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    course_id: schema.string({}, [rules.exists({ table: 'courses', column: 'id' })]),
    title: schema.string({}, [rules.maxLength(255)]),
    description: schema.string(),
  });

  public messages = {};
}
