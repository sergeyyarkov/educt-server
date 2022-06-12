"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/', 'Api/v1/MeController.show').middleware('role:admin,teacher,student').as('me.show');
    Route_1.default.get('/messages/:chat_id', 'Api/v1/MeController.chatHistory')
        .middleware('role:admin,teacher,student')
        .as('me.chat-history');
    Route_1.default.patch('/info', 'Api/v1/MeController.updateInfo').middleware('role:admin,teacher,student').as('me.update-info');
    Route_1.default.patch('/email', 'Api/v1/MeController.changeEmail')
        .middleware('role:admin,teacher,student')
        .as('me.change-email');
    Route_1.default.post('/email/change/confirm', 'Api/v1/MeController.changeEmailConfirm')
        .middleware('role:admin,teacher,student')
        .as('me.change-email-confirm');
    Route_1.default.patch('/password', 'Api/v1/MeController.changePassword')
        .middleware('role:admin,teacher,student')
        .as('me.change-password');
    Route_1.default.patch('/contacts', 'Api/v1/MeController.updateContacts')
        .middleware('role:admin,teacher,student')
        .as('me.update-contacts');
})
    .prefix('v1/me')
    .middleware('auth');
//# sourceMappingURL=me.js.map