"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class Role {
    constructor() {
        Object.defineProperty(this, "error", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.error = {
            message: 'You dont have permission to perform that action.',
            status: 403,
            code: 'E_ACCESS_DENIED',
        };
    }
    check(roles, userRoles) {
        if (!roles.some(role => userRoles.includes(role))) {
            throw new standalone_1.Exception(this.error.message, this.error.status, this.error.code);
        }
    }
    async handle({ auth }, next, roles) {
        const { userId } = auth.use('api').token?.meta;
        const user = await User_1.default.query().where('id', userId).preload('roles').first();
        if (!user) {
            throw new standalone_1.Exception('Cannot identify current user.', this.error.status, this.error.code);
        }
        this.check(roles, user.roles.map(role => role.slug));
        await next();
    }
}
exports.default = Role;
//# sourceMappingURL=Role.js.map