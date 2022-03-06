import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/StatController.index').middleware('role:admin,teacher,student').as('stat.index');
})
  .prefix('api/v1/stat')
  .middleware('auth');
