"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post('/', 'Api/v1/ImagesController.create').as('images.create');
    Route_1.default.delete('/:id', 'Api/v1/ImagesController.delete').as('images.delete');
    Route_1.default.get('/', 'Api/v1/ImagesController.list').as('images.list');
    Route_1.default.get('/:id', 'Api/v1/ImagesController.show').as('images.show');
})
    .prefix('v1/images')
    .middleware('auth');
//# sourceMappingURL=images.js.map