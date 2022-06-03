import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/MeController.show').middleware('role:admin,teacher,student').as('me.show');
  Route.get('/messages/:chat_id', 'Api/v1/MeController.chatHistory')
    .middleware('role:admin,teacher,student')
    .as('me.chat-history');
  Route.patch('/info', 'Api/v1/MeController.updateInfo').middleware('role:admin,teacher,student').as('me.update-info');
  Route.patch('/email', 'Api/v1/MeController.changeEmail')
    .middleware('role:admin,teacher,student')
    .as('me.change-email');
  Route.post('/email/change/confirm', 'Api/v1/MeController.changeEmailConfirm')
    .middleware('role:admin,teacher,student')
    .as('me.change-email-confirm');
  Route.patch('/password', 'Api/v1/MeController.changePassword')
    .middleware('role:admin,teacher,student')
    .as('me.change-password');
  Route.patch('/contacts', 'Api/v1/MeController.updateContacts')
    .middleware('role:admin,teacher,student')
    .as('me.update-contacts');
})
  .prefix('v1/me')
  .middleware('auth');
