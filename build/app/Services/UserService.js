"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const RoleRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/RoleRepository"));
const UserRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/UserRepository"));
const CourseService_1 = __importDefault(require("./CourseService"));
const RoleEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/RoleEnum"));
const RoleHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/RoleHelper"));
const CourseRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/CourseRepository"));
let UserService = class UserService {
    constructor(userRepository, roleRepository, courseRepository, courseService) {
        Object.defineProperty(this, "userRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roleRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "courseRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "courseService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.courseRepository = courseRepository;
        this.courseService = courseService;
    }
    async fetchUser(id) {
        const user = await this.userRepository.getById(id);
        if (!user) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'User not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched user.',
            data: user,
        };
    }
    async fetchUsers(params) {
        const users = await this.userRepository.getAll(params);
        const result = {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched all users.',
            data: {},
        };
        if (users instanceof Array) {
            result.data = users;
            return result;
        }
        result.data = users.data;
        result.meta = {
            pagination: users.meta,
        };
        return result;
    }
    async createUser(data, ctx) {
        const role = await this.roleRepository.getBySlug(data.role);
        if (!role) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Role not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await ctx.bouncer.with('RolePolicy').authorize('manage', [role.slug]);
        const user = await this.userRepository.create(data);
        await user.related('roles').attach([role.id]);
        await user.load('roles');
        return {
            success: true,
            status: HttpStatusEnum_1.default.CREATED,
            message: 'User created.',
            data: user,
        };
    }
    async updateUser(id, data, ctx) {
        const user = await this.userRepository.getById(id);
        if (!user) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'User not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await ctx.bouncer.with('RolePolicy').authorize('manage', user.roles.map(r => r.slug));
        if (data.role) {
            const role = await this.roleRepository.getBySlug(data.role);
            if (role) {
                await ctx.bouncer.with('RolePolicy').authorize('manage', [data.role]);
                await this.userRepository.updateRoles(user, [role]);
            }
        }
        const updated = await this.userRepository.update(id, data);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'User updated.',
            data: updated || {},
        };
    }
    async deleteUser(id, ctx) {
        const user = await this.userRepository.getById(id);
        if (!user) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'User not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await ctx.bouncer.with('RolePolicy').authorize('manage', user.roles.map(r => r.slug));
        if (RoleHelper_1.default.userContainRoles(user.roles, [RoleEnum_1.default.TEACHER, RoleEnum_1.default.ADMIN])) {
            const courses = await this.courseRepository.getByTeacherId(id);
            await this.courseService.deleteAllFiles(courses);
        }
        await this.userRepository.delete(id);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'User deleted.',
            data: user,
        };
    }
    async attachRolesToUser(id, input) {
        const user = await this.userRepository.getById(id);
        if (!user) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'User not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const roles = await this.roleRepository.getAll({ roles: input });
        let attachedRole;
        roles.some(inputRole => {
            const existed = user.roles.find(role => role.slug === inputRole.slug);
            if (existed) {
                attachedRole = inputRole;
                return true;
            }
            return false;
        });
        if (attachedRole) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: `Role "${attachedRole.name}" already attached to that user.`,
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        await user.related('roles').attach([...roles.map(r => r.id)]);
        await user.load('roles');
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Roles attached.',
            data: user.roles,
        };
    }
    async detachRolesFromUser(id, input) {
        const user = await this.userRepository.getById(id);
        if (!user) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'User not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const roles = await this.roleRepository.getAll({ roles: input });
        let notAttachedRole;
        roles.forEach(role => {
            if (!user.roles.map(r => r.id).includes(role.id)) {
                notAttachedRole = role;
            }
        });
        if (notAttachedRole) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: `Role "${notAttachedRole.name}" not attached to that user.`,
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        await user.related('roles').detach([...roles.map(r => r.id)]);
        await user.load('roles');
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Roles detached.',
            data: user.roles,
        };
    }
};
UserService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [UserRepository_1.default,
        RoleRepository_1.default,
        CourseRepository_1.default,
        CourseService_1.default])
], UserService);
exports.default = UserService;
new standalone_1.Ioc().make(UserService);
//# sourceMappingURL=UserService.js.map