"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const RoleEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/RoleEnum"));
class UpdateUserValidator {
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
                first_name: Validator_1.schema.string.optional(),
                last_name: Validator_1.schema.string.optional(),
                about: Validator_1.schema.string.optional(),
                login: Validator_1.schema.string.optional({}, [Validator_1.rules.unique({ table: 'users', column: 'login' })]),
                email: Validator_1.schema.string.optional({}, [Validator_1.rules.email(), Validator_1.rules.unique({ table: 'users', column: 'email' })]),
                password: Validator_1.schema.string.optional(),
                role: Validator_1.schema.enum.optional(Object.values(RoleEnum_1.default)),
            })
        });
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                'login.unique': '"Login" filed is already in use.',
                'email.unique': '"Email" field is already in use.',
            }
        });
    }
}
exports.default = UpdateUserValidator;
//# sourceMappingURL=UpdateUserValidator.js.map