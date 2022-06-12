"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UpdateCourseValidator {
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
                title: Validator_1.schema.string.optional(),
                description: Validator_1.schema.string.optional(),
                education_description: Validator_1.schema.string.nullable(),
                image: Validator_1.schema.file.optional({
                    size: '10mb',
                    extnames: ['jpg', 'jpeg', 'png', 'webp'],
                }),
                teacher_id: Validator_1.schema.string.optional({}, [Validator_1.rules.exists({ table: 'users', column: 'id' })]),
                category_id: Validator_1.schema.string.optional({}, [Validator_1.rules.exists({ table: 'categories', column: 'id' })]),
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
exports.default = UpdateCourseValidator;
//# sourceMappingURL=UpdateCourseValidator.js.map