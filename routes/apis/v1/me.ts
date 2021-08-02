import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/MeController.show').middleware('role:admin,teacher,student').as('me.show');
  Route.patch('/password', 'Api/v1/MeController.changePassword')
    .middleware('role:admin,teacher,student')
    .as('me.change-password');
  Route.put('/contacts', 'Api/v1/MeController.updateContacts')
    .middleware('role:admin,teacher,student')
    .as('me.update-contacts');
}).prefix('me');
