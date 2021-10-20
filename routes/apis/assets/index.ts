import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  /**
   * Serve background image for course
   */
  Route.get('/images/courses/:fileName', 'Api/AssetsController.serveCourseImage').as('serve.course.image');
})
  .prefix('assets')
  .as('assets');
