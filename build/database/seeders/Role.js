"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
class RoleSeeder extends Seeder_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "Role", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async run() {
        this.Role = Role_1.default;
        await this.Role.createMany([
            {
                name: 'Administrator',
                slug: 'admin',
            },
            {
                name: 'Teacher',
                slug: 'teacher',
            },
            {
                name: 'Student',
                slug: 'student',
            },
        ]);
    }
}
exports.default = RoleSeeder;
//# sourceMappingURL=Role.js.map