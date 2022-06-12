"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class LessonProgresses extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'lesson_progresses'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id');
            table.string('user_id', 21).unsigned().references('users.id').onDelete('CASCADE');
            table.string('lesson_id', 21).unsigned().references('lessons.id').onDelete('CASCADE');
            table.boolean('is_watched').notNullable();
            table.unique(['user_id', 'lesson_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = LessonProgresses;
//# sourceMappingURL=1640112055569_lesson_progresses.js.map