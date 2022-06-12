"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateCategoryValidator {
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
                description: Validator_1.schema.string.optional(),
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
exports.default = CreateCategoryValidator;
//# sourceMappingURL=CreateCategoryValidator.js.map