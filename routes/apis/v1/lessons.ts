import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/LessonsController.list').middleware('role:admin,teacher,student').as('lessons.list');
  Route.post('/', 'Api/v1/LessonsController.create').middleware('role:admin,teacher').as('lessons.create');
  Route.post('/save-order', 'Api/v1/LessonsController.saveOrder')
    .middleware('role:admin,teacher')
    .as('lessons.update-order');
  Route.get('/:id', 'Api/v1/LessonsController.show').middleware('role:admin,teacher,student').as('lessons.show');
  Route.delete('/:id', 'Api/v1/LessonsController.delete').middleware('role:admin,teacher').as('lessons.delete');
  Route.put('/:id', 'Api/v1/LessonsController.update').middleware('role:admin,teacher').as('lessons.update');
  Route.get('/:id/content', 'Api/v1/LessonsController.getContent')
    .middleware('role:admin,teacher,student')
    .as('lessons.get-content');
  Route.get('/materials/:fileName', 'Api/v1/LessonsController.getMaterial')
    .middleware('role:admin,teacher,student')
    .as('lessons.get-material');
  Route.get('/video/:fileName', 'Api/v1/LessonsController.getVideo')
    .middleware('role:admin,teacher,student')
    .as('lessons.get-video');
  Route.get('/:id/progress', 'Api/v1/LessonsController.getVideoProgress')
    .middleware('role:admin,teacher,student')
    .as('lessons.get-video-progress');
}).prefix('lessons');
