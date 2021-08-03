import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateLessonValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    course_id: schema.string({}, [rules.exists({ table: 'courses', column: 'id' })]),
    title: schema.string({}, [rules.maxLength(255)]),
    description: schema.string(),
    video_url: schema.string(),
  });

  public messages = {};
}
