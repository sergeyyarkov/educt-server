"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class ChangePasswordValidator {
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
                oldPassword: Validator_1.schema.string({}, [Validator_1.rules.maxLength(128)]),
                newPassword: Validator_1.schema.string({}, [Validator_1.rules.minLength(6), Validator_1.rules.maxLength(128)]),
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
exports.default = ChangePasswordValidator;
//# sourceMappingURL=ChangePasswordValidator.js.map