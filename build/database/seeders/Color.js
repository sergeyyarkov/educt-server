"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const ColorEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/ColorEnum"));
const Color_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Color"));
class RoleSeeder extends Seeder_1.default {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "Color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async run() {
        this.Color = Color_1.default;
        await this.Color.createMany(Object.keys(ColorEnum_1.default).map(k => ({
            name: k,
            hex: ColorEnum_1.default[k],
        })));
    }
}
exports.default = RoleSeeder;
//# sourceMappingURL=Color.js.map