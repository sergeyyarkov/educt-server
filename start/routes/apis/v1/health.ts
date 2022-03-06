import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';

Route.group(() => {
  Route.get('/', async (ctx: HttpContextContract) => {
    const report = await HealthCheck.getReport();

    return report.healthy ? ctx.response.ok(report) : ctx.response.badRequest(report);
  }).as('health');
})
  .prefix('api/v1/health')
  .middleware('auth');
