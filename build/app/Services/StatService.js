"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const WsService_1 = __importDefault(require("./WsService"));
let StatService = class StatService {
    async fetchStatData() {
        const count = await Database_1.default.rawQuery(`
        select (select count(*) from courses) as courses_count,
        (select count(*) from lessons) as lessons_count
      `);
        const online = await WsService_1.default.sessionStore.getOnlineSessions();
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched stat.',
            data: {
                ...count.rows[0],
                online: online.length,
            },
        };
    }
};
StatService = __decorate([
    (0, standalone_1.inject)()
], StatService);
exports.default = StatService;
new standalone_1.Ioc().make(StatService);
//# sourceMappingURL=StatService.js.map