"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Contacts extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'contacts'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id').primary();
            table.string('user_id', 21).unsigned().references('users.id').unique().onDelete('CASCADE');
            table.string('phone_number').unique();
            table.string('vk_id').unique();
            table.string('twitter_id').unique();
            table.string('telegram_id').unique();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Contacts;
//# sourceMappingURL=1627022639849_contacts.js.map