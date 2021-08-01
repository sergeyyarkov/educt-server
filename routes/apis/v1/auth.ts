import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('login', 'AuthController.login').as('auth.login');
  Route.post('logout', 'AuthController.logout').middleware('auth').as('auth.logout');
}).prefix('auth');
