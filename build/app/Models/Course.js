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
const nanoid_1 = require("nanoid");
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const ColorHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/ColorHelper"));
const Category_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Category"));
const Lesson_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Lesson"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const CourseStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/CourseStatusEnum"));
const Color_1 = __importDefault(require("./Color"));
class Course extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "image", {
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
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "education_description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "teacher_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "category_id", {
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
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "category", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "teacher", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lessons", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "students", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "likes", {
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
    static assignCourseId(course) {
        course.id = (0, nanoid_1.nanoid)();
    }
    static async assignRandomColor(course) {
        const color = await ColorHelper_1.default.generateRandomColor();
        if (color) {
            course.color_id = color.id;
        }
    }
    serializeExtras() {
        return {
            students_count: this.$extras.students_count,
            likes_count: this.$extras.likes_count,
            lessons_count: this.$extras.lessons_count,
        };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], Course.prototype, "id", void 0);
__decorate([
    (0, AttachmentLite_1.attachment)({ folder: 'images/courses', preComputeUrl: true }),
    __metadata("design:type", Object)
], Course.prototype, "image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Course.prototype, "education_description", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", String)
], Course.prototype, "teacher_id", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", String)
], Course.prototype, "category_id", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", Object)
], Course.prototype, "color_id", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Color_1.default, {
        foreignKey: 'color_id',
    }),
    __metadata("design:type", Object)
], Course.prototype, "color", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Course.prototype, "status", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Category_1.default, {
        foreignKey: 'category_id',
    }),
    __metadata("design:type", Object)
], Course.prototype, "category", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, {
        foreignKey: 'teacher_id',
    }),
    __metadata("design:type", Object)
], Course.prototype, "teacher", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => Lesson_1.default, {
        foreignKey: 'course_id',
    }),
    __metadata("design:type", Object)
], Course.prototype, "lessons", void 0);
__decorate([
    (0, Orm_1.manyToMany)(() => User_1.default, {
        pivotTable: 'users_courses',
    }),
    __metadata("design:type", Object)
], Course.prototype, "students", void 0);
__decorate([
    (0, Orm_1.manyToMany)(() => User_1.default, {
        pivotTable: 'courses_likes',
        pivotTimestamps: {
            createdAt: 'liked_on',
            updatedAt: false,
        },
        pivotColumns: ['liked_on'],
    }),
    __metadata("design:type", Object)
], Course.prototype, "likes", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Course.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Course.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Course]),
    __metadata("design:returntype", void 0)
], Course, "assignCourseId", null);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Course]),
    __metadata("design:returntype", Promise)
], Course, "assignRandomColor", null);
exports.default = Course;
//# sourceMappingURL=Course.js.map