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
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const RoleEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/RoleEnum"));
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const CodeErrorEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/CodeErrorEnum"));
const ContactRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/ContactRepository"));
const UserRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/UserRepository"));
const RoleHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/RoleHelper"));
const WsService_1 = __importDefault(require("./WsService"));
let MeService = class MeService {
    constructor(userRepository, contactRepository) {
        Object.defineProperty(this, "userRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contactRepository", {
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
        this.contactRepository = contactRepository;
    }
    async fetchUserData(auth) {
        const user = await auth.use(this.authGuard).authenticate();
        await user.load(loader => {
            loader
                .load('roles')
                .load('contacts')
                .load('likes', q => q.select('id'));
        });
        if (RoleHelper_1.default.userHasRoles(user.roles, [RoleEnum_1.default.STUDENT])) {
            await user.load('courses', q => {
                q.preload('category', loader => loader.preload('color'));
                q.withCount('students');
                q.withCount('likes');
                q.withCount('lessons');
            });
        }
        const notifications = await WsService_1.default.notificationStore.getNotifications(user.id);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched authorized user data.',
            data: {
                ...user.toJSON(),
                notifications,
            },
        };
    }
    async changeUserPassword(oldPassword, newPassword, auth) {
        const user = await auth.use(this.authGuard).authenticate();
        if (!(await Hash_1.default.verify(user.password, oldPassword))) {
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
        const passwordUpdated = await this.userRepository.updatePassword(newPassword, user.id);
        if (passwordUpdated) {
            Logger_1.default.info(`Password of user with id: "${user.id}" was updated.`);
            return {
                success: true,
                status: HttpStatusEnum_1.default.OK,
                message: 'Password updated.',
                data: {},
            };
        }
        return {
            success: false,
            status: HttpStatusEnum_1.default.BAD_REQUEST,
            message: 'Unable to change password',
            data: {},
            error: {
                code: 'E_BAD_REQUEST',
            },
        };
    }
    static async changeUserEmail(email) {
        const isConfirmationCodeExist = await Redis_1.default.get(`code.change.email:${email}`);
        if (isConfirmationCodeExist) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.SERVICE_UNAVAILABLE,
                message: 'Please wait a few seconds before send new confirmation code.',
                data: {},
                error: {
                    code: CodeErrorEnum_1.default.CONFIRM_CODE_EXIST,
                },
            };
        }
        const EXPIRE_SECONDS = 120;
        const confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            await Mail_1.default.send(message => {
                message.to(email).subject('Confirmation code.').htmlView('emails/change_email_confirm', { confirmationCode });
            });
        }
        catch (error) {
            Logger_1.default.error(`Email send error: ${error}`);
            return {
                success: false,
                status: HttpStatusEnum_1.default.SERVICE_UNAVAILABLE,
                message: 'Unable send confirmation code.',
                data: {
                    error,
                },
                error: {
                    code: 'E_SERVICE_UNAVAILABLE',
                },
            };
        }
        await Redis_1.default.set(`code.change.email:${email}`, confirmationCode, 'EX', EXPIRE_SECONDS);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'The confirmation code has been sent.',
            data: {
                expired_seconds: EXPIRE_SECONDS,
            },
        };
    }
    static async changeUserEmailConfirm(ctx, email, code) {
        const user = await ctx.auth.use('api').authenticate();
        const confirmationCode = await Redis_1.default.get(`code.change.email:${email}`);
        if (confirmationCode === null) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Cannot find the confirmation code for this email.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        if (Number.parseInt(confirmationCode, 10) !== code) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: 'Confirmation code is invalid.',
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        await user.merge({ email }).save();
        await Redis_1.default.del(`code.change.email:${email}`);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'User email updated.',
            data: { email },
        };
    }
    async updateUserContacts(data, auth) {
        const user = await auth.use(this.authGuard).authenticate();
        const contacts = await this.contactRepository.update(user, data);
        if (contacts) {
            return {
                success: true,
                status: HttpStatusEnum_1.default.OK,
                message: 'User contacts updated.',
                data: contacts,
            };
        }
        await this.contactRepository.create(user, data);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'User contacts updated.',
            data: user.contacts,
        };
    }
    async updateUserInfo(data, auth) {
        const user = await auth.use(this.authGuard).authenticate();
        const { about, ...newContacts } = data;
        if (Object.keys(data).length === 0) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: 'You must specify at least one field.',
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        if (about !== undefined) {
            await this.userRepository.updateInfo(user.id, data);
        }
        if (data.phone_number !== undefined || data.twitter_id !== undefined || data.telegram_id !== undefined) {
            const contacts = await this.contactRepository.update(user, newContacts);
            if (!contacts) {
                await this.contactRepository.create(user, newContacts);
            }
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'User contacts updated.',
            data: { ...data },
        };
    }
    async fetchChatHistory(chatId, auth) {
        const firstUser = await auth.use(this.authGuard).authenticate();
        const secondUser = await this.userRepository.getById(chatId);
        if (!secondUser) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Chat not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const history = await WsService_1.default.messageStore.getHistory(firstUser.id, secondUser.id);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Chat history fetched.',
            data: {
                history,
            },
        };
    }
};
MeService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [UserRepository_1.default, ContactRepository_1.default])
], MeService);
exports.default = MeService;
new standalone_1.Ioc().make(MeService);
//# sourceMappingURL=MeService.js.map