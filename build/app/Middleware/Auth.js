"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/auth/build/standalone");
class AuthMiddleware {
    constructor() {
        Object.defineProperty(this, "redirectTo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: '/login'
        });
    }
    async authenticate(auth, guards) {
        let guardLastAttempted;
        const authResults = await Promise.all(guards.map(guard => auth.use(guard).check()));
        for (let i = 0; i < authResults.length; i += 1) {
            if (authResults[i])
                return;
        }
        throw new standalone_1.AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', guardLastAttempted, this.redirectTo);
    }
    async handle(ctx, next, customGuards) {
        const token = ctx.request.cookie('token');
        if (token) {
            ctx.request.headers().authorization = `Bearer ${token}`;
        }
        const guards = customGuards.length ? customGuards : [ctx.auth.name];
        await this.authenticate(ctx.auth, guards);
        await next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map