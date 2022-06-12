"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
const CourseStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/CourseStatusEnum"));
class Courses extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'courses'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.string('id', 21).primary();
            table.json('image');
            table.string('title').notNullable();
            table.string('description').notNullable();
            table.string('education_description', 250);
            table.string('teacher_id', 21).unsigned().references('users.id').notNullable().onDelete('CASCADE');
            table.string('category_id', 21).unsigned().references('categories.id').notNullable().onDelete('CASCADE');
            table.integer('color_id').unsigned().references('colors.id');
            table
                .enu('status', Object.values(CourseStatusEnum_1.default), {
                useNative: true,
                enumName: 'course_status_enum',
                existingType: false,
                schemaName: 'public',
            })
                .notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        await this.schema.raw('DROP TYPE IF EXISTS "course_status_enum" CASCADE');
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Courses;
//# sourceMappingURL=1627300211260_courses.js.map