"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const factories_1 = global[Symbol.for('ioc.use')]("Database/factories");
class UserSeeder extends Seeder_1.default {
    async run() {
        const roles = {
            admin: await Role_1.default.findByOrFail('slug', 'admin'),
            teacher: await Role_1.default.findByOrFail('slug', 'teacher'),
            student: await Role_1.default.findByOrFail('slug', 'student'),
        };
        const administrator = await User_1.default.create({
            first_name: 'John',
            last_name: 'Doe',
            login: 'admin',
            password: '123456',
            email: 'administrator@example.com',
        });
        await administrator.related('roles').attach([roles.admin.id]);
        const teacher = await User_1.default.create({
            first_name: 'Hanna',
            last_name: 'Liv',
            login: 'teacher',
            password: '123456',
            email: 'teacher@example.com',
        });
        await teacher.related('roles').attach([roles.teacher.id]);
        const student = await User_1.default.create({
            first_name: 'Ylfa',
            last_name: 'Erna',
            login: 'student',
            password: '123456',
            email: 'student@example.com',
        });
        await student.related('roles').attach([roles.student.id]);
        await factories_1.StudentFactory.with('contacts').createMany(20);
    }
}
exports.default = UserSeeder;
//# sourceMappingURL=User.js.map