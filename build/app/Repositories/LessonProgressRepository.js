"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LessonProgress_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LessonProgress"));
class LessonProgressRepository {
    constructor() {
        Object.defineProperty(this, "LessonProgress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.LessonProgress = LessonProgress_1.default;
    }
    async get(user_id, lesson_id) {
        const progress = await this.LessonProgress.query()
            .where('user_id', user_id)
            .andWhere('lesson_id', lesson_id)
            .first();
        return progress;
    }
    async create(data) {
        const progress = await this.LessonProgress.create(data);
        return progress;
    }
}
exports.default = LessonProgressRepository;
//# sourceMappingURL=LessonProgressRepository.js.map