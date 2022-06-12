"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/', 'Api/v1/LessonsController.list').middleware('role:admin,teacher,student').as('lessons.list');
    Route_1.default.post('/', 'Api/v1/LessonsController.create').middleware('role:admin,teacher').as('lessons.create');
    Route_1.default.post('/save-order', 'Api/v1/LessonsController.saveOrder')
        .middleware('role:admin,teacher')
        .as('lessons.update-order');
    Route_1.default.get('/:id', 'Api/v1/LessonsController.show').middleware('role:admin,teacher,student').as('lessons.show');
    Route_1.default.delete('/:id', 'Api/v1/LessonsController.delete').middleware('role:admin,teacher').as('lessons.delete');
    Route_1.default.patch('/:id', 'Api/v1/LessonsController.update').middleware('role:admin,teacher').as('lessons.update');
    Route_1.default.get('/:id/content', 'Api/v1/LessonsController.getContent')
        .middleware('role:admin,teacher,student')
        .as('lessons.get-content');
    Route_1.default.get('/materials/:fileName', 'Api/v1/LessonsController.getMaterial')
        .middleware('role:admin,teacher,student')
        .as('lessons.get-material');
    Route_1.default.get('/:id/progress', 'Api/v1/LessonsController.getVideoProgress')
        .middleware('role:admin,teacher,student')
        .as('lessons.get-video-progress');
})
    .prefix('v1/lessons')
    .middleware('auth');
//# sourceMappingURL=lessons.js.map