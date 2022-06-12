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
const UserService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/UserService"));
const AddRoleToUserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/User/AddRoleToUserValidator"));
const CreateUserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/User/CreateUserValidator"));
const DelRoleFromUserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/User/DelRoleFromUserValidator"));
const UpdateUserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/User/UpdateUserValidator"));
const BaseController_1 = __importDefault(require("../../BaseController"));
let UsersController = class UsersController extends BaseController_1.default {
    constructor(userService) {
        super();
        Object.defineProperty(this, "userService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.userService = userService;
    }
    async list(ctx) {
        const result = await this.userService.fetchUsers(ctx.request.qs());
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status, result.meta);
    }
    async show(ctx) {
        const result = await this.userService.fetchUser(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async create(ctx) {
        const payload = await ctx.request.validate(CreateUserValidator_1.default);
        const result = await this.userService.createUser(payload, ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async update(ctx) {
        const payload = await ctx.request.validate(UpdateUserValidator_1.default);
        const result = await this.userService.updateUser(ctx.params.id, payload, ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async delete(ctx) {
        const result = await this.userService.deleteUser(ctx.params.id, ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async attachRoles(ctx) {
        const payload = await ctx.request.validate(AddRoleToUserValidator_1.default);
        const result = await this.userService.attachRolesToUser(ctx.params.id, payload.roles);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async detachRoles(ctx) {
        const payload = await ctx.request.validate(DelRoleFromUserValidator_1.default);
        const result = await this.userService.detachRolesFromUser(ctx.params.id, payload.roles);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
};
UsersController = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [UserService_1.default])
], UsersController);
exports.default = UsersController;
new standalone_1.Ioc().make(UsersController);
//# sourceMappingURL=UsersController.js.map