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
const CategoryService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/CategoryService"));
const CreateCategoryValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Category/CreateCategoryValidator"));
const UpdateCategoryValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Category/UpdateCategoryValidator"));
const BaseController_1 = __importDefault(require("../../BaseController"));
let CategoriesController = class CategoriesController extends BaseController_1.default {
    constructor(categoryService) {
        super();
        Object.defineProperty(this, "categoryService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.categoryService = categoryService;
    }
    async list(ctx) {
        const result = await this.categoryService.fetchCategories();
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async show(ctx) {
        const result = await this.categoryService.fetchCategory(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async create(ctx) {
        const payload = await ctx.request.validate(CreateCategoryValidator_1.default);
        const result = await this.categoryService.createCategory(payload);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async delete(ctx) {
        const result = await this.categoryService.deleteCategory(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async update(ctx) {
        const payload = await ctx.request.validate(UpdateCategoryValidator_1.default);
        const result = await this.categoryService.updateCategory(ctx.params.id, payload);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
};
CategoriesController = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [CategoryService_1.default])
], CategoriesController);
exports.default = CategoriesController;
new standalone_1.Ioc().make(CategoriesController);
//# sourceMappingURL=CategoriesController.js.map