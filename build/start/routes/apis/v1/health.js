"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const HealthCheck_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HealthCheck"));
Route_1.default.group(() => {
    Route_1.default.get('/', async (ctx) => {
        const report = await HealthCheck_1.default.getReport();
        return report.healthy ? ctx.response.ok(report) : ctx.response.badRequest(report);
    }).as('health');
})
    .prefix('v1/health')
    .middleware('auth');
//# sourceMappingURL=health.js.map