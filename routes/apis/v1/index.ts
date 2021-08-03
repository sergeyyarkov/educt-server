/* eslint-disable global-require */
import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', () => `Educt Backend API.`).as('index');

  /**
   *
   * Auth module
   *
   */
  require('./auth');

  Route.group(() => {
    /**
     *
     * Users module
     *
     */
    require('./users');

    /**
     *
     * Me module
     *
     */
    require('./me');

    /**
     *
     * Courses module
     *
     */
    require('./courses');

    /**
     *
     * Lessons module
     *
     */
    require('./lessons');
  }).middleware('auth');
})
  .prefix('v1')
  .as('v1');
