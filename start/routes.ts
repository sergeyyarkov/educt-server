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
  Route.post('login', 'AuthController.login').as('login');
  Route.post('logout', 'AuthController.logout').middleware('auth').as('logout');

  /* API */
  Route.group(() => {
    /**
     * Users controller
     */
    Route.get('users', 'UsersController.index').middleware('role:admin,teacher,student').as('showAllUsers');
    Route.post('users', 'UsersController.create').middleware('role:admin').as('createUser');
    Route.get('users/:id', 'UsersController.show').middleware('role:admin,teacher,student').as('showUserById');
    Route.patch('users/:id', 'UsersController.update').middleware('role:admin').as('updateUser');
    Route.delete('users/:id', 'UsersController.destroy').middleware('role:admin').as('deleteUser');
    Route.post('users/:id/attach-roles', 'UsersController.attachRoles').middleware('role:admin').as('attachUserRole');
    Route.delete('users/:id/detach-roles', 'UsersController.detachRoles').middleware('role:admin').as('detachUserRole');

    /**
     * Me controller
     */
    Route.get('me', 'MeController.index').middleware('role:admin,teacher,student').as('showMe');
    Route.patch('me/password', 'MeController.changePassword')
      .middleware('role:admin,teacher,student')
      .as('changePassword');

    Route.put('me/contacts', 'MeController.updateContacts')
      .middleware('role:admin,teacher,student')
      .as('updateContacts');

    /**
     * Courses controller
     */
    Route.get('courses', 'CoursesController.index').middleware('role:admin,teacher,student').as('showAllCourses');
    Route.post('courses', 'CoursesController.create').middleware('role:admin,teacher').as('createCourse');
    Route.get('courses/:id', 'CoursesController.show').middleware('role:admin,teacher,student').as('showCourseById');
    Route.delete('courses/:id', 'CoursesController.destroy').middleware('role:admin,teacher').as('deleteCourseById');
    Route.patch('courses/:id', 'CoursesController.update').middleware('role:admin,teacher').as('updateCourse');
    Route.get('courses/:id/teacher', 'CoursesController.showTeacher')
      .middleware('role:admin,teacher,student')
      .as('showCourseTeacher');

    Route.get('courses/:id/category', 'CoursesController.showCategory')
      .middleware('role:admin,teacher,student')
      .as('showCourseCategory');

    Route.get('courses/:id/lessons', 'CoursesController.showLessons')
      .middleware('role:admin,teacher,student')
      .as('showCourseLessons');

    Route.get('courses/:id/students', 'CourseController.showStudents')
      .middleware('role:admin,teacher,student')
      .as('showCourseStudents');
  }).middleware('auth');
})
  .prefix('/api/v1')
  .as('api');
