import RoleEnum from 'App/Datatypes/Enums/RoleEnum';
import type Role from 'App/Models/Role';

export default class RoleHelper {
  /**
   * If the user roles is not found in the array of roles
   * then return false
   *
   * @param userRoles Roles of existing user
   * @param roles Roles to check
   * @returns boolean
   */
  public static userHasRoles(userRoles: Role[], roles: RoleEnum[]): boolean {
    for (let i = 0; i < roles.length; i += 1) {
      if (!userRoles.map(r => r.slug).includes(roles[i])) {
        /**
         * Unable to find current role in user roles
         */
        return false;
      }
    }
    return true;
  }

  public static userContainRoles(userRoles: Role[], roles: RoleEnum[]): boolean {
    return userRoles.map(r => r.slug as RoleEnum).some(r => roles.includes(r));
  }
}
