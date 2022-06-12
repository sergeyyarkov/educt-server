"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const LessonVideo_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LessonVideo"));
const LessonService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/LessonService"));
const BaseController_1 = __importDefault(require("./BaseController"));
let VideosController = class VideosController extends BaseController_1.default {
    constructor(lessonService) {
        super();
        Object.defineProperty(this, "lessonService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.lessonService = lessonService;
    }
    async getVideo(ctx) {
        const { fileName } = ctx.request.params();
        const { data, message, status, success, error } = await this.lessonService.fetchVideoFile(ctx, fileName);
        if (!success && error) {
            throw new standalone_1.Exception(message, status, error.code);
        }
        if (data instanceof LessonVideo_1.default) {
            ctx.response.header('Accept-Ranges', 'bytes');
            return this.sendFileFromDrive(`videos/${data.name}`, ctx);
        }
        return this.sendResponse(ctx, data, message, status);
    }
};
VideosController = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [LessonService_1.default])
], VideosController);
exports.default = VideosController;
new standalone_1.Ioc().make(VideosController);
//# sourceMappingURL=VideosController.js.map