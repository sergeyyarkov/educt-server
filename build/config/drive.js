"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const config_1 = require("@adonisjs/core/build/config");
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
exports.default = (0, config_1.driveConfig)({
    disk: Env_1.default.get('DRIVE_DISK'),
    disks: {
        local: {
            driver: 'local',
            visibility: 'private',
            root: Application_1.default.makePath('uploads'),
            serveFiles: true,
            basePath: '/uploads',
        },
        s3: {
            driver: 's3',
            visibility: 'private',
            key: Env_1.default.get('S3_KEY'),
            secret: Env_1.default.get('S3_SECRET'),
            region: Env_1.default.get('S3_REGION'),
            bucket: Env_1.default.get('S3_BUCKET'),
            endpoint: Env_1.default.get('S3_ENDPOINT'),
        },
    },
});
//# sourceMappingURL=drive.js.map