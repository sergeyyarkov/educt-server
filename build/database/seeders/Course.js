"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const factories_1 = global[Symbol.for('ioc.use')]("Database/factories");
class CourseSeeder extends Seeder_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "CourseFactory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async run() {
        this.CourseFactory = factories_1.CourseFactory;
        const LESSONS_COUNT = 10;
        await this.CourseFactory.with('lessons', LESSONS_COUNT, lessonFactory => lessonFactory
            .with('content')
            .merge(new Array(LESSONS_COUNT).fill(LESSONS_COUNT).map((_, i) => ({ display_order: i + 1 }))))
            .with('category')
            .with('teacher')
            .createMany(3);
    }
}
exports.default = CourseSeeder;
//# sourceMappingURL=Course.js.map