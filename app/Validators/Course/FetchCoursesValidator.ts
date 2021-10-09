import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';

export default class FetchCoursesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    status: schema.enum.optional(Object.values(CourseStatusEnum)),
  });

  public messages = {};
}
