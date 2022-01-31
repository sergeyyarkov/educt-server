import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CreateLessonValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    course_id: schema.string({}, [rules.exists({ table: 'courses', column: 'id' })]),
    title: schema.string({}, [rules.maxLength(255)]),
    description: schema.string(),
    duration: schema.date({ format: 'HH:mm:ss' }),
    video: schema.file({
      size: '5000mb',
      extnames: ['mp4', 'mov', 'avi', 'wmv', 'webm', 'flv'],
    }),
    materials: schema.array.optional().members(
      schema.file({
        size: '100mb',
        extnames: ['pdf', 'zip', 'rar', 'doc', 'docx'],
      })
    ),
  });

  public messages = {};
}
