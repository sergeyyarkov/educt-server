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
const AuthService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/AuthService"));
const AuthValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Auth/AuthValidator"));
const BaseController_1 = __importDefault(require("../../BaseController"));
let AuthController = class AuthController extends BaseController_1.default {
    constructor(authService) {
        super();
        Object.defineProperty(this, "authService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.authService = authService;
    }
    async login(ctx) {
        const payload = await ctx.request.validate(AuthValidator_1.default);
        const result = await this.authService.login(payload.login, payload.password, ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async logout(ctx) {
        const result = await this.authService.logout(ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
};
AuthController = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [AuthService_1.default])
], AuthController);
exports.default = AuthController;
new standalone_1.Ioc().make(AuthController);
//# sourceMappingURL=AuthController.js.map