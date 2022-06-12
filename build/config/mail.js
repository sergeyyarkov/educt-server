"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const config_1 = require("@adonisjs/mail/build/config");
exports.default = (0, config_1.mailConfig)({
    mailer: Env_1.default.get('MAILER'),
    mailers: {
        smtp: {
            driver: 'smtp',
            host: Env_1.default.get('SMTP_HOST'),
            port: Env_1.default.get('SMTP_PORT'),
            auth: {
                user: Env_1.default.get('SMTP_USERNAME'),
                pass: Env_1.default.get('SMTP_PASSWORD'),
                type: 'login',
            },
        },
        mailgun: {
            driver: 'mailgun',
            baseUrl: 'https://api.mailgun.net/v3',
            key: Env_1.default.get('MAILGUN_API_KEY'),
            domain: Env_1.default.get('MAILGUN_DOMAIN'),
        },
    },
});
//# sourceMappingURL=mail.js.map