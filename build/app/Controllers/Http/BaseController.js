"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const path_1 = require("path");
class BaseController {
    sendResponse(ctx, data, message, status = 200, meta) {
        const response = {
            status,
            message,
            data,
            meta,
        };
        return ctx.response.status(response.status).send(response);
    }
    sendStream(ctx, ...args) {
        return ctx.response.stream(...args);
    }
    sendFile(ctx, ...args) {
        return ctx.response.attachment(...args);
    }
    async sendFileFromDrive(pathname, ctx) {
        if (!(await Drive_1.default.exists(pathname)))
            return ctx.response.notFound();
        const { size } = await Drive_1.default.getStats(pathname);
        ctx.response.type((0, path_1.extname)(pathname));
        ctx.response.header('content-length', size);
        const stream = await Drive_1.default.getStream(pathname);
        return this.sendStream(ctx, stream);
    }
}
exports.default = BaseController;
//# sourceMappingURL=BaseController.js.map