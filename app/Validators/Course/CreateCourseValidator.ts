import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateCourseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string(),
    description: schema.string(),
    background_image: schema.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
    teacher_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
    category_id: schema.string({}, [rules.exists({ table: 'categories', column: 'id' })]),
  });

  public messages = {};
}
