"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class CoursesLikes extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'courses_likes'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id').primary();
            table.string('user_id', 21).unsigned().references('users.id').onDelete('CASCADE');
            table.string('course_id', 21).unsigned().references('courses.id').onDelete('CASCADE');
            table.timestamp('liked_on', { useTz: true });
            table.unique(['user_id', 'course_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = CoursesLikes;
//# sourceMappingURL=1628622517837_courses_likes.js.map