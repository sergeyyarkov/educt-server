import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateCourseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional(),
    description: schema.string.optional(),
    image: schema.file.optional({
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
    teacher_id: schema.string.optional({}, [rules.exists({ table: 'users', column: 'id' })]),
    category_id: schema.string.optional({}, [rules.exists({ table: 'categories', column: 'id' })]),
  });

  public messages = {};
}
