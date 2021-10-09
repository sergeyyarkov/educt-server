/* eslint-disable global-require */
import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', () => {
    return 'Backend API.';
  }).as('index');

  /**
   *
   * Auth module
   *
   */
  require('./auth');

  Route.group(() => {
    /**
     *
     * Health check
     *
     */
    require('./health');

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

    /**
     *
     * Images module
     *
     */
    require('./images');

    /**
     *
     * Categories module
     *
     */
    require('./categories');
  }).middleware('auth');
})
  .prefix('v1')
  .as('v1');
