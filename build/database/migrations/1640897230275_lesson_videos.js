"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class LessonVideos extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'lesson_videos'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id');
            table.string('lesson_id', 21).unsigned().references('lessons.id').onDelete('CASCADE').notNullable();
            table.string('name').notNullable();
            table.integer('size').notNullable();
            table.string('client_name').notNullable();
            table.string('ext').notNullable();
            table.string('url').notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
            table.unique(['lesson_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = LessonVideos;
//# sourceMappingURL=1640897230275_lesson_videos.js.map