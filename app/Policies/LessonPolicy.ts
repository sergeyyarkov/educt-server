import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';

/**
 * Helpers
 */
import RoleHelper from 'App/Helpers/RoleHelper';

/**
 * Models
 */
import Lesson from 'App/Models/Lesson';
import User from 'App/Models/User';

/**
 * Datatypes
 */
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';

export default class LessonPolicy extends BasePolicy {
  public async view(user: User, lesson: Lesson) {
    /**
     * Load required data to check permissions
     */
    await user.load(loader => loader.load('roles').load('courses'));
    await lesson.load('course');

    const isAdminOrTeacher = RoleHelper.userContainRoles(user.roles, [RoleEnum.ADMIN, RoleEnum.TEACHER]);

    if (isAdminOrTeacher) {
      return true;
    }

    return !!user.courses.find(course => course.id === lesson.course.id);
  }
}
