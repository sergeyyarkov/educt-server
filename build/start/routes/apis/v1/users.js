"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/', 'Api/v1/UsersController.list').middleware('role:admin,teacher,student').as('users.list');
    Route_1.default.post('/', 'Api/v1/UsersController.create').middleware('role:admin,teacher').as('users.create');
    Route_1.default.get('/:id', 'Api/v1/UsersController.show').middleware('role:admin,teacher,student').as('users.show');
    Route_1.default.patch('/:id', 'Api/v1/UsersController.update').middleware('role:admin,teacher').as('users.update');
    Route_1.default.delete('/:id', 'Api/v1/UsersController.delete').middleware('role:admin,teacher').as('users.delete');
    Route_1.default.post('/:id/attach-roles', 'Api/v1/UsersController.attachRoles')
        .middleware('role:admin')
        .as('users.attach-role');
    Route_1.default.delete('/:id/detach-roles', 'Api/v1/UsersController.detachRoles')
        .middleware('role:admin')
        .as('users.detach-role');
})
    .prefix('v1/users')
    .middleware('auth');
//# sourceMappingURL=users.js.map