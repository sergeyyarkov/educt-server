"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const CourseStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/CourseStatusEnum"));
class CreateCourseValidator {
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
                title: Validator_1.schema.string(),
                description: Validator_1.schema.string(),
                education_description: Validator_1.schema.string.nullable(),
                image: Validator_1.schema.file.optional({
                    size: '10mb',
                    extnames: ['jpg', 'jpeg', 'png', 'webp'],
                }),
                teacher_id: Validator_1.schema.string({}, [Validator_1.rules.exists({ table: 'users', column: 'id' })]),
                category_id: Validator_1.schema.string({}, [Validator_1.rules.exists({ table: 'categories', column: 'id' })]),
                status: Validator_1.schema.enum(Object.values(CourseStatusEnum_1.default)),
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
exports.default = CreateCourseValidator;
//# sourceMappingURL=CreateCourseValidator.js.map