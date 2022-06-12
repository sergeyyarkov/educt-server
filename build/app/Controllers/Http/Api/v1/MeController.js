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
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const MeService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/MeService"));
const ChangePasswordValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Password/ChangePasswordValidator"));
const UpdateContactsValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Contacts/UpdateContactsValidator"));
const UpdateUserInfoValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/User/UpdateUserInfoValidator"));
const BaseController_1 = __importDefault(require("../../BaseController"));
let MeController = class MeController extends BaseController_1.default {
    constructor(meService) {
        super();
        Object.defineProperty(this, "meService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.meService = meService;
    }
    async show(ctx) {
        const result = await this.meService.fetchUserData(ctx.auth);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async changePassword(ctx) {
        const payload = await ctx.request.validate(ChangePasswordValidator_1.default);
        const result = await this.meService.changeUserPassword(payload.oldPassword, payload.newPassword, ctx.auth);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async changeEmail(ctx) {
        const payload = await ctx.request.validate({
            schema: Validator_1.schema.create({
                email: Validator_1.schema.string({}, [Validator_1.rules.email(), Validator_1.rules.unique({ table: 'users', column: 'email' })]),
            }),
            messages: {
                'email.unique': 'Email is not available.',
            },
        });
        const result = await MeService_1.default.changeUserEmail(payload.email);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async changeEmailConfirm(ctx) {
        const confirmChangeEmailSchema = Validator_1.schema.create({
            email: Validator_1.schema.string({}, [Validator_1.rules.email(), Validator_1.rules.unique({ table: 'users', column: 'email' })]),
            confirmationCode: Validator_1.schema.number(),
        });
        const payload = await ctx.request.validate({ schema: confirmChangeEmailSchema });
        const result = await MeService_1.default.changeUserEmailConfirm(ctx, payload.email, payload.confirmationCode);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async updateContacts(ctx) {
        const payload = await ctx.request.validate(UpdateContactsValidator_1.default);
        const result = await this.meService.updateUserContacts(payload, ctx.auth);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async updateInfo(ctx) {
        const payload = await ctx.request.validate(UpdateUserInfoValidator_1.default);
        const result = await this.meService.updateUserInfo(payload, ctx.auth);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async chatHistory(ctx) {
        const result = await this.meService.fetchChatHistory(ctx.params.chat_id, ctx.auth);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
};
MeController = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [MeService_1.default])
], MeController);
exports.default = MeController;
new standalone_1.Ioc().make(MeController);
//# sourceMappingURL=MeController.js.map