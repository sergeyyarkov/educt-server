"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/conversations', 'Api/v1/ChatController.getConversations')
        .middleware('role:admin,teacher,student')
        .as('chat.get-conversations');
})
    .prefix('v1/chat')
    .middleware('auth');
//# sourceMappingURL=chat.js.map