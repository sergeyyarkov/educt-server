import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'MeController.show').middleware('role:admin,teacher,student').as('me.show');
  Route.patch('/password', 'MeController.changePassword')
    .middleware('role:admin,teacher,student')
    .as('me.change-password');
  Route.put('/contacts', 'MeController.updateContacts')
    .middleware('role:admin,teacher,student')
    .as('me.update-contacts');
}).prefix('me');
