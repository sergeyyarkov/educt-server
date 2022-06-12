"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/', 'Api/v1/CategoriesController.list').middleware('role:admin,teacher,student').as('categories.list');
    Route_1.default.get('/:id', 'Api/v1/CategoriesController.show').middleware('role:admin,teacher,student').as('categories.show');
    Route_1.default.post('/', 'Api/v1/CategoriesController.create').middleware('role:admin,teacher').as('categories.create');
    Route_1.default.delete('/:id', 'Api/v1/CategoriesController.delete').middleware('role:admin,teacher').as('categories.delete');
    Route_1.default.patch('/:id', 'Api/v1/CategoriesController.update').middleware('role:admin,teacher').as('categories.update');
})
    .prefix('v1/categories')
    .middleware('auth');
//# sourceMappingURL=categories.js.map