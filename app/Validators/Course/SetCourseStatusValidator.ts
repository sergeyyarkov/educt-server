import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Datatypes
 */
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';

export default class SetCourseStatusValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    status: schema.enum(Object.values(CourseStatusEnum)),
  });

  public messages = {};
}
