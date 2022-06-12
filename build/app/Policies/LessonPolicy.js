"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bouncer_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Bouncer");
const RoleHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/RoleHelper"));
const RoleEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/RoleEnum"));
class LessonPolicy extends Bouncer_1.BasePolicy {
    async view(user, lesson) {
        await user.load(loader => loader.load('roles').load('courses'));
        await lesson.load('course');
        const isAdminOrTeacher = RoleHelper_1.default.userContainRoles(user.roles, [RoleEnum_1.default.ADMIN, RoleEnum_1.default.TEACHER]);
        if (isAdminOrTeacher) {
            return true;
        }
        return !!user.courses.find(course => course.id === lesson.course.id);
    }
}
exports.default = LessonPolicy;
//# sourceMappingURL=LessonPolicy.js.map