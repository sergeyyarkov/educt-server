"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Lessons extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'lessons'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.string('id', 21).primary();
            table.string('course_id', 21).unsigned().references('courses.id').onDelete('CASCADE');
            table.string('title').notNullable();
            table.integer('display_order').notNullable();
            table.integer('color_id').unsigned().references('colors.id');
            table.string('description');
            table.text('linked_video_url').nullable();
            table.time('duration').notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Lessons;
//# sourceMappingURL=1628016919501_lessons.js.map