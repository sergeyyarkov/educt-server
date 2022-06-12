"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class AttachStudentsValitator {
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
                students: Validator_1.schema.array().members(Validator_1.schema.string({}, [
                    Validator_1.rules.exists({ table: 'users', column: 'id' }),
                    Validator_1.rules.unique({
                        table: 'users_courses',
                        column: 'user_id',
                        where: {
                            course_id: this.ctx.params.id,
                        },
                    }),
                ])),
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
exports.default = AttachStudentsValitator;
//# sourceMappingURL=AttachStudentsValitator.js.map