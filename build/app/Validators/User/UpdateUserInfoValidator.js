"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UpdateUserInfoValidator {
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
                about: Validator_1.schema.string.nullableAndOptional(),
                phone_number: Validator_1.schema.string.nullableAndOptional({}, [
                    Validator_1.rules.mobile({ locale: ['ru-RU', 'en-US'], strict: true }),
                    Validator_1.rules.unique({ table: 'contacts', column: 'phone_number' }),
                ]),
                vk_id: Validator_1.schema.string.nullableAndOptional({}, [
                    Validator_1.rules.regex(/^([a-zA-Z0-9_]){1,64}$/),
                    Validator_1.rules.unique({ table: 'contacts', column: 'vk_id' }),
                ]),
                twitter_id: Validator_1.schema.string.nullableAndOptional({}, [
                    Validator_1.rules.regex(/(^|[^@\w])@(\w{1,15})\b/),
                    Validator_1.rules.unique({ table: 'contacts', column: 'twitter_id' }),
                ]),
                telegram_id: Validator_1.schema.string.nullableAndOptional({}, [
                    Validator_1.rules.regex(/(^|[^@\w])@(\w{1,64})\b/),
                    Validator_1.rules.unique({ table: 'contacts', column: 'telegram_id' }),
                ]),
            })
        });
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                'phone_number.unique': 'This phone number is not available.',
                'vk_id.unique': 'This ID is not available.',
                'twitter_id.unique': 'Twitter username is not available.',
                'telegram_id.unique': 'Telegram username is not available.',
            }
        });
    }
}
exports.default = UpdateUserInfoValidator;
//# sourceMappingURL=UpdateUserInfoValidator.js.map