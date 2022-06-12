"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class AddCourseToUserValidator {
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
                student_id: Validator_1.schema.string({}, [Validator_1.rules.exists({ table: 'users', column: 'id' })]),
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
exports.default = AddCourseToUserValidator;
//# sourceMappingURL=AddCourseToUserValidator.js.map