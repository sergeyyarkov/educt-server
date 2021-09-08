import { schema } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

/**
 * Datatypes
 */
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';

export default class SetCourseStatusValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    status: schema.enum(Object.values(HttpStatusEnum)),
  });

  public messages = {};
}
