import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/video/:fileName', 'VideosController.getVideo')
    .middleware('role:admin,teacher,student')
    .as('videos.get-video');
}).middleware('auth');
