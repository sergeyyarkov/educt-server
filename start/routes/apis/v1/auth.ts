import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('login', 'Api/v1/AuthController.login').as('auth.login');
  Route.post('logout', 'Api/v1/AuthController.logout').middleware('auth').as('auth.logout');
}).prefix('v1/auth');
