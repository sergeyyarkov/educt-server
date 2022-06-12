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
const CourseService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/CourseService"));
const AddCourseToUserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/AddCourseToUserValidator"));
const AttachStudentsValitator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/AttachStudentsValitator"));
const DetachStudentstValitator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/DetachStudentstValitator"));
const CreateCourseValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/CreateCourseValidator"));
const DelCourseFromUserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/DelCourseFromUserValidator"));
const SetCourseStatusValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/SetCourseStatusValidator"));
const UpdateCourseValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/UpdateCourseValidator"));
const FetchCoursesValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/Course/FetchCoursesValidator"));
const BaseController_1 = __importDefault(require("../../BaseController"));
let CoursesController = class CoursesController extends BaseController_1.default {
    constructor(courseService) {
        super();
        Object.defineProperty(this, "courseService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.courseService = courseService;
    }
    async list(ctx) {
        const payload = await ctx.request.validate(FetchCoursesValidator_1.default);
        const result = await this.courseService.fetchCourses(payload);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async show(ctx) {
        const result = await this.courseService.fetchCourse(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async showTeacher(ctx) {
        const result = await this.courseService.fetchCourseTeacher(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async showCategory(ctx) {
        const result = await this.courseService.fetchCourseCategory(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async showLessons(ctx) {
        const result = await this.courseService.fetchCourseLessons(ctx.params.id, ctx);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async showStudents(ctx) {
        const result = await this.courseService.fetchCourseStudents(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async create(ctx) {
        const payload = await ctx.request.validate(CreateCourseValidator_1.default);
        const result = await this.courseService.createCourse(payload);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async delete(ctx) {
        const result = await this.courseService.deleteCourse(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async update(ctx) {
        const payload = await ctx.request.validate(UpdateCourseValidator_1.default);
        const result = await this.courseService.updateCourse(ctx.params.id, payload);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async attachStudent(ctx) {
        const payload = await ctx.request.validate(AddCourseToUserValidator_1.default);
        const result = await this.courseService.attachUserCourse(ctx.params.id, payload.student_id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async attachStudentList(ctx) {
        const payload = await ctx.request.validate(AttachStudentsValitator_1.default);
        const result = await this.courseService.attachStudentList(ctx.params.id, payload.students);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async detachStudent(ctx) {
        const payload = await ctx.request.validate(DelCourseFromUserValidator_1.default);
        const result = await this.courseService.detachUserCourse(ctx.params.id, payload.student_id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async detachStudentList(ctx) {
        const payload = await ctx.request.validate(DetachStudentstValitator_1.default);
        const result = await this.courseService.detachStudentList(ctx.params.id, payload.students);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async studentsCount(ctx) {
        const result = await this.courseService.fetchStudentsCount(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async showLikes(ctx) {
        const result = await this.courseService.fetchCourseLikesCount(ctx.params.id);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async setLike(ctx) {
        const result = await this.courseService.attachUserLike(ctx.params.id, ctx.auth);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async unsetLike(ctx) {
        const result = await this.courseService.detachUserLike(ctx.params.id, ctx.auth);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
    async setStatus(ctx) {
        const payload = await ctx.request.validate(SetCourseStatusValidator_1.default);
        const result = await this.courseService.setCourseStatus(ctx.params.id, payload.status);
        if (!result.success && result.error) {
            throw new standalone_1.Exception(result.message, result.status, result.error.code);
        }
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
};
CoursesController = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [CourseService_1.default])
], CoursesController);
exports.default = CoursesController;
new standalone_1.Ioc().make(CoursesController);
//# sourceMappingURL=CoursesController.js.map