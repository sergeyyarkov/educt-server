/* eslint-disable global-require */
import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  /**
   * v1
   */
  require('./apis/v1/index');

  /**
   * Assets routes
   */
  require('./apis/assets/index');
})
  .prefix('api')
  .as('api');
