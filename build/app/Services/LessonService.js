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
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const CourseRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/CourseRepository"));
const LessonProgressRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/LessonProgressRepository"));
const LessonRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/LessonRepository"));
let LessonService = class LessonService {
    constructor(courseRepository, lessonRepository, lessonProgressRepository) {
        Object.defineProperty(this, "courseRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lessonRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lessonProgressRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }
    async fetchLessons() {
        const lessons = await this.lessonRepository.getAll();
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched all lessons.',
            data: lessons,
        };
    }
    async fetchLesson(id, ctx) {
        const lesson = await this.lessonRepository.getById(id);
        if (!lesson) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Lesson not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await ctx.bouncer.with('LessonPolicy').authorize('view', lesson);
        await lesson.load(loader => loader.load('content').load('materials').load('video'));
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched lesson.',
            data: lesson,
        };
    }
    async fetchMaterialFile(ctx, name) {
        const material = await this.lessonRepository.getMaterialFileByName(name);
        if (!material) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                data: {},
                message: 'Material not found.',
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await material.load('lesson');
        await ctx.bouncer.with('LessonPolicy').authorize('view', material.lesson);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched lesson material.',
            data: material,
        };
    }
    async fetchVideoFile(ctx, name) {
        const video = await this.lessonRepository.getVideoFileByName(name);
        if (!video) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                data: {},
                message: 'Video not found.',
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await video.load('lesson');
        await ctx.bouncer.with('LessonPolicy').authorize('view', video.lesson);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched lesson video.',
            data: video,
        };
    }
    async fetchLessonProgress(id, ctx) {
        const user = await ctx.auth.use('api').authenticate();
        const lesson = await this.lessonRepository.getById(id);
        if (!lesson) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Lesson not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await ctx.bouncer.with('LessonPolicy').authorize('view', lesson);
        const progress = await this.lessonProgressRepository.get(user.id, lesson.id);
        if (!progress) {
            await this.lessonProgressRepository.create({ user_id: user.id, lesson_id: lesson.id, is_watched: true });
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched lesson progress',
            data: {
                progress,
            },
        };
    }
    async createLesson(data) {
        const course = await this.courseRepository.getByIdWithoutRelations(data.course_id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const lesson = await this.lessonRepository.create(course, data);
        return {
            success: true,
            status: HttpStatusEnum_1.default.CREATED,
            message: 'Lesson created.',
            data: lesson,
        };
    }
    async deleteLesson(id) {
        const lesson = await this.lessonRepository.delete(id);
        if (!lesson) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Lesson not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Lesson deleted.',
            data: lesson,
        };
    }
    async updateLesson(id, data) {
        const lesson = await this.lessonRepository.update(id, data);
        if (!lesson) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Lesson not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Lesson updated.',
            data: lesson,
        };
    }
    async fetchLessonContent(id, ctx) {
        const lesson = await this.lessonRepository.getById(id);
        if (!lesson) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Lesson not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await ctx.bouncer.with('LessonPolicy').authorize('view', lesson);
        await lesson.load(loader => loader.load('content').load('materials'));
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched lesson content.',
            data: lesson.content,
        };
    }
    async updateOrder(ids) {
        const params = ids
            .map((id, i) => ({ id, i: i + 1 }))
            .reduce((result, { id, i }) => result.concat(id, i), []);
        const query = `
      UPDATE lessons 
      SET display_order = t.display_order 
      FROM (VALUES ${ids.map(() => `(?, ??)`).join(',')}) as t(id, display_order) 
      WHERE t.id = lessons.id
    `;
        await Database_1.default.rawQuery(query, params);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Order updated.',
            data: {},
        };
    }
};
LessonService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [CourseRepository_1.default,
        LessonRepository_1.default,
        LessonProgressRepository_1.default])
], LessonService);
exports.default = LessonService;
new standalone_1.Ioc().make(LessonService);
//# sourceMappingURL=LessonService.js.map