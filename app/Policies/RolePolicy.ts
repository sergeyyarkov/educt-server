import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';

/**
 * Models
 */
import User from 'App/Models/User';

/**
 * Helpers
 */
import RoleHelper from 'App/Helpers/RoleHelper';

/**
 * Datatypes
 */
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';

export default class RolePolicy extends BasePolicy {
  public async manage(user: User, roles: Array<RoleEnum>) {
    await user.load('roles');

    const isAdmin = RoleHelper.userContainRoles(user.roles, [RoleEnum.ADMIN]);
    const isTeacher = RoleHelper.userContainRoles(user.roles, [RoleEnum.TEACHER]);

    if (isAdmin) {
      return true;
    }

    /**
     * User with role `TEACHER` can manage only user with `STUDENT` role
     */
    if (!(roles.includes(RoleEnum.TEACHER) || roles.includes(RoleEnum.ADMIN)) && isTeacher) {
      return true;
    }
  }
}
