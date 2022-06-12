import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/UsersController.list').middleware('role:admin,teacher,student').as('users.list');
  Route.post('/', 'Api/v1/UsersController.create').middleware('role:admin,teacher').as('users.create');
  Route.get('/:id', 'Api/v1/UsersController.show').middleware('role:admin,teacher,student').as('users.show');
  Route.patch('/:id', 'Api/v1/UsersController.update').middleware('role:admin,teacher').as('users.update');
  Route.delete('/:id', 'Api/v1/UsersController.delete').middleware('role:admin,teacher').as('users.delete');
  Route.post('/:id/attach-roles', 'Api/v1/UsersController.attachRoles')
    .middleware('role:admin')
    .as('users.attach-role');
  Route.delete('/:id/detach-roles', 'Api/v1/UsersController.detachRoles')
    .middleware('role:admin')
    .as('users.detach-role');
})
  .prefix('v1/users')
  .middleware('auth');
