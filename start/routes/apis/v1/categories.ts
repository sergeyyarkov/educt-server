import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/CategoriesController.list').middleware('role:admin,teacher,student').as('categories.list');
  Route.get('/:id', 'Api/v1/CategoriesController.show').middleware('role:admin,teacher,student').as('categories.show');
  Route.post('/', 'Api/v1/CategoriesController.create').middleware('role:admin,teacher').as('categories.create');
  Route.delete('/:id', 'Api/v1/CategoriesController.delete').middleware('role:admin,teacher').as('categories.delete');
  Route.patch('/:id', 'Api/v1/CategoriesController.update').middleware('role:admin,teacher').as('categories.update');
})
  .prefix('v1/categories')
  .middleware('auth');
