"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Users extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'users'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.string('id', 21).primary();
            table.string('first_name', 24).notNullable();
            table.string('last_name', 24).notNullable();
            table.text('about');
            table.string('login', 128).notNullable().unique();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.timestamp('last_login', { useTz: true });
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Users;
//# sourceMappingURL=1626545059989_users.js.map