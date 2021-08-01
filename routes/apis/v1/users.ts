import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'UsersController.list').middleware('role:admin,teacher,student').as('users.list');
  Route.post('/', 'UsersController.create').middleware('role:admin').as('users.create');
  Route.get('/:id', 'UsersController.show').middleware('role:admin,teacher,student').as('users.show');
  Route.patch('/:id', 'UsersController.update').middleware('role:admin').as('users.update');
  Route.delete('/:id', 'UsersController.delete').middleware('role:admin').as('users.delete');
  Route.post('/:id/attach-roles', 'UsersController.attachRoles').middleware('role:admin').as('users.attach-role');
  Route.delete('/:id/detach-roles', 'UsersController.detachRoles').middleware('role:admin').as('users.detach-role');
}).prefix('users');
