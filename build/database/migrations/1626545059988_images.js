"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Images extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'images'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id').primary();
            table.string('path').notNullable();
            table.string('name').notNullable();
            table.string('ext').notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Images;
//# sourceMappingURL=1626545059988_images.js.map