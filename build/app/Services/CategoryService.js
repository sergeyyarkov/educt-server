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
const CategoryRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/CategoryRepository"));
const CourseRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/CourseRepository"));
const CourseService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/CourseService"));
let CategoryService = class CategoryService {
    constructor(categoryRepository, courseRepository, courseService) {
        Object.defineProperty(this, "categoryRepository", {
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
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.courseService = courseService;
    }
    async fetchCategories() {
        const data = await this.categoryRepository.getAll();
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched all categories.',
            data,
        };
    }
    async fetchCategory(id) {
        const data = await this.categoryRepository.getById(id);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Category not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched category.',
            data,
        };
    }
    async createCategory(data) {
        const category = await this.categoryRepository.create(data);
        return {
            success: true,
            status: HttpStatusEnum_1.default.CREATED,
            message: 'Category created.',
            data: category,
        };
    }
    async deleteCategory(id) {
        const data = await this.categoryRepository.getById(id);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Category not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const courses = await this.courseRepository.getByCategoryId(id);
        await this.courseService.deleteAllFiles(courses);
        await this.categoryRepository.delete(id);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Category deleted.',
            data,
        };
    }
    async updateCategory(id, data) {
        const category = await this.categoryRepository.update(id, data);
        if (!category) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Category not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Category updated.',
            data: category,
        };
    }
};
CategoryService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [CategoryRepository_1.default,
        CourseRepository_1.default,
        CourseService_1.default])
], CategoryService);
exports.default = CategoryService;
new standalone_1.Ioc().make(CategoryService);
//# sourceMappingURL=CategoryService.js.map