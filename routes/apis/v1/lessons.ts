import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/LessonsController.list').middleware('role:admin,teacher,student').as('lessons.list');
  Route.post('/', 'Api/v1/LessonsController.create').middleware('role:admin,teacher').as('lessons.create');
  Route.get('/:id', 'Api/v1/LessonsController.show').middleware('role:admin,teacher,student').as('lessons.show');
  Route.delete('/:id', 'Api/v1/LessonsController.delete').middleware('role:admin,teacher').as('lessons.delete');
  Route.put('/:id', 'Api/v1/LessonsController.update').middleware('role:admin,teacher').as('lessons.update');
  Route.get('/:id/content', 'Api/v1/LessonsController.getContent')
    .middleware('role:admin,teacher,student')
    .as('lessons.get-content');
  Route.get('/materials/:file', 'Api/v1/LessonsController.getMaterial')
    .middleware('role:admin,teacher,student')
    .as('lessons.get-material');
}).prefix('lessons');
