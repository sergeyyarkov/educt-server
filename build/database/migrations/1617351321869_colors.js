"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
const ColorEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/ColorEnum"));
class Colors extends Schema_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'colors'
        });
    }
    async up() {
        this.schema.createTable(this.tableName, table => {
            table.increments('id').primary();
            table
                .enu('name', Object.keys(ColorEnum_1.default), {
                useNative: true,
                enumName: 'color_name_enum',
                existingType: false,
                schemaName: 'public',
            })
                .notNullable();
            table.string('hex').notNullable();
        });
    }
    async down() {
        await this.schema.raw('DROP TYPE IF EXISTS "color_name_enum" CASCADE');
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Colors;
//# sourceMappingURL=1617351321869_colors.js.map