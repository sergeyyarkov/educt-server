"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class Validator {
    constructor() {
        Object.defineProperty(this, "errorMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "cacheKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async fire(data, type) {
        return Validator_1.validator.validate({
            schema: this.schemas(type),
            data,
            ...(this.errorMessages[type] ? { messages: this.errorMessages[type] } : {}),
            ...(this.cacheKey ? { cacheKey: this.cacheKey } : {}),
        });
    }
}
exports.default = Validator;
//# sourceMappingURL=Validator.js.map