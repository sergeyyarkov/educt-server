"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class UsersRoles extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users_roles'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id').primary();
            table.string('user_id', 21).unsigned().references('users.id').onDelete('CASCADE');
            table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE');
            table.unique(['user_id', 'role_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = UsersRoles;
//# sourceMappingURL=1626970448054_users_roles.js.map