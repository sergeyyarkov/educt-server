import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('/', 'Api/v1/ImagesController.create').as('images.create');
  Route.delete('/:id', 'Api/v1/ImagesController.delete').as('images.delete');
  Route.get('/', 'Api/v1/ImagesController.list').as('images.list');
  Route.get('/:id', 'Api/v1/ImagesController.show').as('images.show');
})
  .prefix('api/v1/images')
  .middleware('auth');
