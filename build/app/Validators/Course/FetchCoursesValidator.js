"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const CourseStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/CourseStatusEnum"));
class FetchCoursesValidator {
    constructor(ctx) {
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ctx
        });
        Object.defineProperty(this, "schema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Validator_1.schema.create({
                status: Validator_1.schema.enum.optional(Object.values(CourseStatusEnum_1.default)),
                category_id: Validator_1.schema.string.optional({}, [Validator_1.rules.exists({ table: 'categories', column: 'id' })]),
                limit: Validator_1.schema.number.optional(),
            })
        });
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
}
exports.default = FetchCoursesValidator;
//# sourceMappingURL=FetchCoursesValidator.js.map