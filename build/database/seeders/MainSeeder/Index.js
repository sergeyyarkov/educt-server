"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
class IndexSeeder extends Seeder_1.default {
    async runSeeder(seeder) {
        const Seeder = seeder.default;
        if (Seeder.developmentOnly && !Application_1.default.inDev) {
            return;
        }
        await new Seeder(this.client).run();
    }
    async run() {
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Role'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Color'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../User'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Course'))));
    }
}
exports.default = IndexSeeder;
//# sourceMappingURL=Index.js.map