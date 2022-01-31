import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AttachStudentsValitator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    students: schema.array().members(
      schema.string({}, [
        rules.exists({ table: 'users', column: 'id' }),
        rules.unique({
          table: 'users_courses',
          column: 'user_id',
          where: {
            course_id: this.ctx.params.id,
          },
        }),
      ])
    ),
  });

  public messages = {};
}
