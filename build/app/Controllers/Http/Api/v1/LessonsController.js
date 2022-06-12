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
const LessonService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/LessonService"));
const LessonMaterial_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LessonMaterial"));
const CreateLessonValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Lesson/CreateLessonValidator"));
const UpdateLessonValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Lesson/UpdateLessonValidator"));
const BaseController_1 = __importDefault(require("../../BaseController"));
let LessonsController = class LessonsController extends BaseController_1.default {
    constructor(lessonService) {
        super();
        Object.defineProperty(this, "lessonService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.lessonService = lessonService;
    }
    async list(ctx) {
        const result = await this.lessonService.fetchLessons();
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async show(ctx) {
        const result = await this.lessonService.fetchLesson(ctx.params.id, ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async create(ctx) {
        const payload = await ctx.request.validate(CreateLessonValidator_1.default);
        const result = await this.lessonService.createLesson(payload);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async delete(ctx) {
        const result = await this.lessonService.deleteLesson(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async update(ctx) {
        const payload = await ctx.request.validate(UpdateLessonValidator_1.default);
        const result = await this.lessonService.updateLesson(ctx.params.id, payload);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async getContent(ctx) {
        const result = await this.lessonService.fetchLessonContent(ctx.params.id, ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async getMaterial(ctx) {
        const { fileName } = ctx.request.params();
        const { data, message, status, success, error } = await this.lessonService.fetchMaterialFile(ctx, fileName);
        if (!success && error) {
            throw new standalone_1.Exception(message, status, error.code);
        }
        if (data instanceof LessonMaterial_1.default) {
            return this.sendFileFromDrive(`materials/${data.name}`, ctx);
        }
        return this.sendResponse(ctx, data, message, status);
    }
    async saveOrder(ctx) {
        const saveOrderSchema = Validator_1.schema.create({
            ids: Validator_1.schema.array([Validator_1.rules.minLength(1)]).members(Validator_1.schema.string()),
        });
        const payload = await ctx.request.validate({ schema: saveOrderSchema });
        const { data, message, status, success, error } = await this.lessonService.updateOrder(payload.ids);
        if (!success && error) {
            throw new standalone_1.Exception(message, status, error.code);
        }
        return this.sendResponse(ctx, data, message, status);
    }
    async getVideoProgress(ctx) {
        const { data, message, status, success, error } = await this.lessonService.fetchLessonProgress(ctx.params.id, ctx);
        if (!success && error) {
            throw new standalone_1.Exception(message, status, error.code);
        }
        return this.sendResponse(ctx, data, message, status);
    }
};
LessonsController = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [LessonService_1.default])
], LessonsController);
exports.default = LessonsController;
new standalone_1.Ioc().make(LessonsController);
//# sourceMappingURL=LessonsController.js.map