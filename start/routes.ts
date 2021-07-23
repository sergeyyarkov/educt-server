/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', () => `API REST Server.`);

Route.group(() => {
  /* Auth */
  Route.post('login', 'AuthController.login');
  Route.post('logout', 'AuthController.logout').middleware('auth');

  /* API */
  Route.group(() => {
    Route.get('users', 'UsersController.index').middleware('role:admin,teacher,student');
    Route.get('users/:id', 'UsersController.show').middleware('role:admin,teacher,student');
    Route.post('users', 'UsersController.store').middleware('role:admin');
    Route.patch('users/:id', 'UsersController.update').middleware('role:admin');
    Route.delete('users', 'UsersController.destroy').middleware('role:admin');
    Route.post('users/:id/roles', 'RolesController.store').middleware('role:admin');
    Route.delete('users/:id/roles', 'RolesController.destroy').middleware('role:admin');
  }).middleware('auth');
}).prefix('api');
