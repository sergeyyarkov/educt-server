"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.default = Env_1.default.rules({
    HOST: Env_1.default.schema.string({ format: 'host' }),
    PORT: Env_1.default.schema.number(),
    APP_KEY: Env_1.default.schema.string(),
    APP_NAME: Env_1.default.schema.string(),
    NODE_ENV: Env_1.default.schema.enum(['development', 'production', 'test']),
    DRIVE_DISK: Env_1.default.schema.enum(['local', 's3']),
    PG_HOST: Env_1.default.schema.string({ format: 'host' }),
    PG_PORT: Env_1.default.schema.number(),
    PG_USER: Env_1.default.schema.string(),
    PG_PASSWORD: Env_1.default.schema.string.optional(),
    PG_DB_NAME: Env_1.default.schema.string(),
    REDIS_CONNECTION: Env_1.default.schema.enum(['local', 'session']),
    REDIS_HOST: Env_1.default.schema.string({ format: 'host' }),
    REDIS_PORT: Env_1.default.schema.number(),
    REDIS_PASSWORD: Env_1.default.schema.string.optional(),
    MAILER: Env_1.default.schema.enum(['mailgun', 'smtp']),
    SMTP_HOST: Env_1.default.schema.string({ format: 'host' }),
    SMTP_PORT: Env_1.default.schema.number(),
    SMTP_USERNAME: Env_1.default.schema.string(),
    SMTP_PASSWORD: Env_1.default.schema.string(),
    MAILGUN_API_KEY: Env_1.default.schema.string(),
    MAILGUN_DOMAIN: Env_1.default.schema.string(),
    S3_KEY: Env_1.default.schema.string(),
    S3_SECRET: Env_1.default.schema.string(),
    S3_BUCKET: Env_1.default.schema.string(),
    S3_REGION: Env_1.default.schema.string(),
    S3_ENDPOINT: Env_1.default.schema.string.optional(),
});
//# sourceMappingURL=env.js.map