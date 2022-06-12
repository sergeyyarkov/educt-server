import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UpdateLessonValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    course_id: schema.string.optional({}, [rules.exists({ table: 'courses', column: 'id' })]),
    title: schema.string.optional({}, [rules.maxLength(255)]),
    description: schema.string.optional(),
    duration: schema.date.optional({ format: 'HH:mm:ss' }),
    video: schema.file.optional({
      size: '5000mb',
      extnames: ['mp4', 'mov', 'avi', 'wmv', 'webm', 'flv'],
    }),
    linked_video_url: schema.string.optional([rules.regex(new RegExp('^(http|https|ftp)://'))]),
    materials: schema.array.nullableAndOptional().members(
      schema.file({
        size: '100mb',
        extnames: ['pdf', 'zip', 'rar', 'doc', 'docx'],
      })
    ),
  });

  public messages = {};
}
