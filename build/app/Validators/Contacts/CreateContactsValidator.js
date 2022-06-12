"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateContactsValidator {
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
                phone_number: Validator_1.schema.string.nullableAndOptional({}, [
                    Validator_1.rules.mobile({
                        locale: ['ru-RU', 'en-US'],
                        strict: true,
                    }),
                ]),
                vk_id: Validator_1.schema.string.nullableAndOptional({}, [Validator_1.rules.regex(/^[a-zA-Z0-9_]+$/)]),
                twitter_id: Validator_1.schema.string.nullableAndOptional({}, [Validator_1.rules.regex(/^[a-zA-Z0-9_]+$/)]),
                telegram_id: Validator_1.schema.string.nullableAndOptional({}, [Validator_1.rules.regex(/^[a-zA-Z0-9_]+$/)]),
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
exports.default = CreateContactsValidator;
//# sourceMappingURL=CreateContactsValidator.js.map