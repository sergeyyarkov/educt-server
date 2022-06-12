"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const WsService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/WsService"));
const BaseController_1 = __importDefault(require("../../BaseController"));
let ChatController = class ChatController extends BaseController_1.default {
    async getConversations(ctx) {
        const user = await ctx.auth.authenticate();
        const data = await WsService_1.default.messageStore.getConversations(user.id);
        const result = {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched conversations.',
            data,
        };
        return this.sendResponse(ctx, result.data, result.message, result.status);
    }
};
ChatController = __decorate([
    (0, standalone_1.inject)()
], ChatController);
exports.default = ChatController;
new standalone_1.Ioc().make(ChatController);
//# sourceMappingURL=ChatController.js.map