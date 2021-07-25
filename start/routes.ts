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

Route.get('/', () => `Educt Backend API.`);

Route.group(() => {
  /* Auth controller */
  Route.post('login', 'AuthController.login');
  Route.post('logout', 'AuthController.logout').middleware('auth');

  /* API */
  Route.group(() => {
    /**
     * Users controller
     */
    Route.get('users/me', 'UsersController.me').middleware('role:admin,teacher,student');
    Route.get('users', 'UsersController.index').middleware('role:admin,teacher,student');
    Route.get('users/:id', 'UsersController.show').middleware('role:admin,teacher,student');
    Route.post('users', 'UsersController.store').middleware('role:admin');
    Route.patch('users/:id', 'UsersController.update').middleware('role:admin');
    Route.delete('users/:id', 'UsersController.destroy').middleware('role:admin');
    Route.post('users/:id/attach_roles', 'UsersController.attach_roles').middleware('role:admin');
    Route.delete('users/:id/detach_roles', 'UsersController.detach_roles').middleware('role:admin');
  }).middleware('auth');
}).prefix('api');
