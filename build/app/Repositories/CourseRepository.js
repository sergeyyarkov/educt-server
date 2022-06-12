"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
const Course_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Course"));
class CourseRepository {
    constructor() {
        Object.defineProperty(this, "Database", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "Course", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Database = Database_1.default;
        this.Course = Course_1.default;
    }
    async getByTeacherId(id) {
        const data = await this.Course.query()
            .preload('lessons', q => q.preload('video').preload('materials'))
            .where('teacher_id', id);
        return data;
    }
    async getByCategoryId(id) {
        const data = await this.Course.query()
            .preload('lessons', q => q.preload('video').preload('materials'))
            .where('category_id', id);
        return data;
    }
    async setStatus(id, status) {
        const data = await this.Course.query().where('id', id).update({ status }).first();
        return data;
    }
    async getAll(params) {
        const { status, category_id, limit } = params || {};
        const query = this.Course.query();
        if (category_id) {
            query.andWhereHas('category', q => q.where('id', category_id));
        }
        if (status) {
            query.andWhere('status', status);
        }
        if (limit) {
            query.limit(limit);
        }
        const courses = await query
            .preload('color')
            .preload('category')
            .withCount('students')
            .withCount('likes')
            .withCount('lessons')
            .orderBy('created_at', 'desc');
        return courses;
    }
    async getById(id) {
        const course = await this.Course.query()
            .preload('teacher')
            .preload('color')
            .preload('category', q => q.preload('color'))
            .preload('lessons', q => q.preload('color').orderBy('display_order', 'asc').withCount('materials'))
            .preload('students', q => q.preload('roles').preload('contacts'))
            .withCount('likes')
            .withCount('lessons')
            .withCount('students')
            .where('id', id)
            .first();
        return course;
    }
    async getByIdWithoutRelations(id, params) {
        const { status } = params || {};
        const query = this.Course.query().where('id', id);
        if (status) {
            query.where('status', status);
        }
        const course = await query.first();
        return course;
    }
    async getLikesCount(id) {
        const likes = await this.Database.query().from('courses_likes').where('course_id', id).count('* as count');
        return likes[0].count;
    }
    async getTeacher(id) {
        const course = await this.Course.query()
            .select('teacher_id')
            .preload('teacher', user => user.preload('contacts').preload('roles'))
            .where('id', id)
            .first();
        return course && course.teacher;
    }
    async getCategory(id) {
        const course = await this.Course.query().select('category_id').preload('category').where('id', id).first();
        return course && course.category;
    }
    async getLessons(id, userId) {
        const course = await this.Course.query()
            .select('id')
            .preload('lessons', q => q
            .preload('progress', p => p.where('user_id', userId))
            .preload('color')
            .orderBy('display_order', 'asc'))
            .where('id', id)
            .first();
        return course && course.lessons;
    }
    async getStudents(id) {
        const course = await this.Course.query().preload('students').where('id', id).first();
        return course && course.students;
    }
    async getStudentsCount(id) {
        const students = await this.Database.query().from('users_courses').where('course_id', id).count('* as count');
        return students[0].count;
    }
    async create(data) {
        const course = new this.Course();
        course.title = data.title;
        course.description = data.description;
        course.education_description = data.education_description;
        course.status = data.status;
        course.teacher_id = data.teacher_id;
        course.category_id = data.category_id;
        if (data.image) {
            course.image = AttachmentLite_1.Attachment.fromFile(data.image);
        }
        await course.save();
        return course;
    }
    async delete(id) {
        const course = await this.Course.query()
            .preload('category')
            .preload('lessons', q => q.preload('video').preload('materials'))
            .withCount('students')
            .withCount('likes')
            .withCount('lessons')
            .where('id', id)
            .first();
        if (course) {
            await course.delete();
            return course;
        }
        return null;
    }
    async update(id, data) {
        const course = await this.Course.query()
            .preload('teacher')
            .preload('category')
            .preload('lessons')
            .where('id', id)
            .first();
        if (course) {
            course.merge({
                title: data.title,
                description: data.description,
                education_description: data.education_description,
                teacher_id: data.teacher_id,
                category_id: data.category_id,
            });
            if (data.image) {
                course.image = AttachmentLite_1.Attachment.fromFile(data.image);
            }
            await course.load('category');
            await course.load('teacher');
            await course.save();
            return course;
        }
        return null;
    }
}
exports.default = CourseRepository;
//# sourceMappingURL=CourseRepository.js.map