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
const luxon_1 = require("luxon");
const nanoid_1 = require("nanoid");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const ColorHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/ColorHelper"));
const Course_1 = __importDefault(require("./Course"));
const LessonMaterial_1 = __importDefault(require("./LessonMaterial"));
const LessonContent_1 = __importDefault(require("./LessonContent"));
const LessonProgress_1 = __importDefault(require("./LessonProgress"));
const LessonVideo_1 = __importDefault(require("./LessonVideo"));
const Color_1 = __importDefault(require("./Color"));
class Lesson extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "course_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "display_order", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "linked_video_url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "duration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "course", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "color_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "content", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "video", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "materials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "progress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "createdAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "updatedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    static assignLessonId(lesson) {
        lesson.id = (0, nanoid_1.nanoid)();
    }
    static async assignRandomColor(course) {
        const color = await ColorHelper_1.default.generateRandomColor();
        if (color) {
            course.color_id = color.id;
        }
    }
    serializeExtras() {
        return {
            materials_count: this.$extras.materials_count,
        };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], Lesson.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lesson.prototype, "course_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lesson.prototype, "title", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Number)
], Lesson.prototype, "display_order", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lesson.prototype, "description", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Lesson.prototype, "linked_video_url", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lesson.prototype, "duration", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Course_1.default, {
        foreignKey: 'course_id',
    }),
    __metadata("design:type", Object)
], Lesson.prototype, "course", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Object)
], Lesson.prototype, "color_id", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Color_1.default, {
        foreignKey: 'color_id',
    }),
    __metadata("design:type", Object)
], Lesson.prototype, "color", void 0);
__decorate([
    (0, Orm_1.hasOne)(() => LessonContent_1.default, {
        foreignKey: 'lesson_id',
    }),
    __metadata("design:type", Object)
], Lesson.prototype, "content", void 0);
__decorate([
    (0, Orm_1.hasOne)(() => LessonVideo_1.default, {
        foreignKey: 'lesson_id',
    }),
    __metadata("design:type", Object)
], Lesson.prototype, "video", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => LessonMaterial_1.default, { foreignKey: 'lesson_id' }),
    __metadata("design:type", Object)
], Lesson.prototype, "materials", void 0);
__decorate([
    (0, Orm_1.hasOne)(() => LessonProgress_1.default, {
        foreignKey: 'lesson_id',
    }),
    __metadata("design:type", Object)
], Lesson.prototype, "progress", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Lesson.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Lesson.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Lesson]),
    __metadata("design:returntype", void 0)
], Lesson, "assignLessonId", null);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Course_1.default]),
    __metadata("design:returntype", Promise)
], Lesson, "assignRandomColor", null);
exports.default = Lesson;
//# sourceMappingURL=Lesson.js.map