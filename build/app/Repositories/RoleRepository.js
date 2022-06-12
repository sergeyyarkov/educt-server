"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
class RoleRepository {
    constructor() {
        Object.defineProperty(this, "Role", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Role = Role_1.default;
    }
    async getAll(params) {
        const { roles } = params || {};
        const query = this.Role.query();
        if (roles) {
            query.whereIn('slug', roles);
        }
        const data = await query;
        return data;
    }
    async getBySlug(slug) {
        const role = await this.Role.query().where('slug', slug).first();
        return role;
    }
}
exports.default = RoleRepository;
//# sourceMappingURL=RoleRepository.js.map