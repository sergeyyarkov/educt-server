"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleHelper {
    static userHasRoles(userRoles, roles) {
        for (let i = 0; i < roles.length; i += 1) {
            if (!userRoles.map(r => r.slug).includes(roles[i])) {
                return false;
            }
        }
        return true;
    }
    static userContainRoles(userRoles, roles) {
        return userRoles.map(r => r.slug).some(r => roles.includes(r));
    }
}
exports.default = RoleHelper;
//# sourceMappingURL=RoleHelper.js.map