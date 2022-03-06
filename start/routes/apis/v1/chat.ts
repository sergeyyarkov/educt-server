import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/conversations', 'Api/v1/ChatController.getConversations')
    .middleware('role:admin,teacher,student')
    .as('chat.get-conversations');
})
  .prefix('api/v1/chat')
  .middleware('auth');
