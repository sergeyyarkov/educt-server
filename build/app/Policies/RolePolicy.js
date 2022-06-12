"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bouncer_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer");
const RoleHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/RoleHelper"));
const RoleEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/RoleEnum"));
class RolePolicy extends Bouncer_1.BasePolicy {
    async manage(user, roles) {
        await user.load('roles');
        const isAdmin = RoleHelper_1.default.userContainRoles(user.roles, [RoleEnum_1.default.ADMIN]);
        const isTeacher = RoleHelper_1.default.userContainRoles(user.roles, [RoleEnum_1.default.TEACHER]);
        if (isAdmin) {
            return true;
        }
        if (!(roles.includes(RoleEnum_1.default.TEACHER) || roles.includes(RoleEnum_1.default.ADMIN)) && isTeacher) {
            return true;
        }
    }
}
exports.default = RolePolicy;
//# sourceMappingURL=RolePolicy.js.map