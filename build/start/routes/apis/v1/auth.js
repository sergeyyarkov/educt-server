"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post('login', 'Api/v1/AuthController.login').as('auth.login');
    Route_1.default.post('logout', 'Api/v1/AuthController.logout').middleware('auth').as('auth.logout');
}).prefix('v1/auth');
//# sourceMappingURL=auth.js.map