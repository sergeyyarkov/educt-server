import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';

export default class CreateCourseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string(),
    description: schema.string(),
    bg_image_id: schema.number.optional([rules.exists({ table: 'images', column: 'id' })]),
    teacher_id: schema.string({}, [rules.exists({ table: 'users', column: 'id' })]),
    category_id: schema.string({}, [rules.exists({ table: 'categories', column: 'id' })]),
    status: schema.enum(Object.values(CourseStatusEnum)),
  });

  public messages = {};
}
