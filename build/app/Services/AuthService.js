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
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const UserRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/UserRepository"));
let AuthService = class AuthService {
    constructor(userRepository) {
        Object.defineProperty(this, "userRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "authGuard", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.userRepository = userRepository;
    }
    async login(login, password, ctx) {
        const user = await this.userRepository.getByColumn('login', login);
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
        if (!(await Hash_1.default.verify(user.password, password))) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.UNAUTHORIZED,
                message: 'Invalid credentials.',
                data: {},
                error: {
                    code: 'E_INVALID_CREDENTIALS',
                },
            };
        }
        const token = await ctx.auth.use(this.authGuard).generate(user, {
            expiresIn: '1d',
            userId: user.id,
            userRoles: user.roles.map(role => role.slug),
            userName: user.fullname,
        });
        ctx.response.cookie('token', token.token);
        await this.userRepository.updateLastLogin(user.id);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Login success.',
            data: {
                userId: user.id,
                ...token.toJSON(),
            },
        };
    }
    async logout(ctx) {
        ctx.response.clearCookie('token');
        await ctx.auth.use(this.authGuard).revoke();
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Logout success.',
            data: {},
        };
    }
};
AuthService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [UserRepository_1.default])
], AuthService);
exports.default = AuthService;
new standalone_1.Ioc().make(AuthService);
//# sourceMappingURL=AuthService.js.map