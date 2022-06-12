"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateLessonValidator {
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
                course_id: Validator_1.schema.string({}, [Validator_1.rules.exists({ table: 'courses', column: 'id' })]),
                title: Validator_1.schema.string({}, [Validator_1.rules.maxLength(255)]),
                description: Validator_1.schema.string(),
                duration: Validator_1.schema.date({ format: 'HH:mm:ss' }),
                video: Validator_1.schema.file.optional({
                    size: '5000mb',
                    extnames: ['mp4', 'mov', 'avi', 'wmv', 'webm', 'flv'],
                }),
                linked_video_url: Validator_1.schema.string.optional([Validator_1.rules.regex(new RegExp('^(http|https|ftp)://'))]),
                materials: Validator_1.schema.array.optional().members(Validator_1.schema.file({
                    size: '100mb',
                    extnames: ['pdf', 'zip', 'rar', 'doc', 'docx'],
                })),
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
exports.default = CreateLessonValidator;
//# sourceMappingURL=CreateLessonValidator.js.map