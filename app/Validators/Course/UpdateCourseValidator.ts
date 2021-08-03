import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateCourseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({}, [rules.unique({ table: 'courses', column: 'title' })]),
    description: schema.string.optional(),
    teacher_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    category_id: schema.string.optional({}, [rules.exists({ table: 'categories', column: 'id' })]),
  });

  public messages = {};
}
