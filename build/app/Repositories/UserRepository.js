"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const luxon_1 = require("luxon");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class UserRepository {
    constructor() {
        Object.defineProperty(this, "User", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.User = User_1.default;
    }
    async getById(id) {
        const data = await this.User.query().preload('contacts').preload('roles').where('id', id).first();
        return data;
    }
    async getByIds(ids) {
        const data = await this.User.query().preload('contacts').preload('roles').whereIn('id', ids);
        return data;
    }
    async getByColumn(column, value) {
        const data = await this.User.query().preload('contacts').preload('roles').where(column, value).first();
        return data;
    }
    async getAllByRole(role) {
        const data = await this.User.query()
            .preload('contacts')
            .preload('roles')
            .whereHas('roles', q => q.where('slug', role));
        return data;
    }
    async getAll(params) {
        const { search, email, login, first_name, last_name, role, page, limit } = params || {};
        const query = this.User.query();
        if (email) {
            query.where('email', 'like', `%${email}%`);
        }
        if (login) {
            query.where('login', 'like', `%${login}%`);
        }
        if (first_name) {
            query.where('first_name', 'like', `%${first_name}%`);
        }
        if (last_name) {
            query.where('last_name', 'like', `%${last_name}%`);
        }
        if (search) {
            query
                .orWhere('first_name', 'ilike', `%${search}%`)
                .orWhere('last_name', 'ilike', `%${search}%`)
                .orWhereRaw(`CONCAT(first_name, ' ', last_name) ilike ?`, [search])
                .orWhere('email', 'like', `${search}`)
                .orWhere('id', 'like', `${search}`);
        }
        if (role) {
            query.whereHas('roles', q => q.where('slug', role));
        }
        query.preload('contacts').preload('roles').orderBy('created_at', 'desc');
        if (limit && page) {
            const data = await query.paginate(page, limit);
            return data.toJSON();
        }
        const data = await query;
        return data;
    }
    async create(data) {
        const user = await this.User.create({
            first_name: data.first_name.charAt(0).toUpperCase() + data.first_name.substr(1),
            last_name: data.last_name.charAt(0).toUpperCase() + data.last_name.substr(1),
            login: data.login,
            email: data.email,
            password: data.password,
        });
        await user.load('contacts');
        await user.load('roles');
        return user;
    }
    async update(id, data) {
        const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();
        const { role, ...updatedFields } = data;
        if (user) {
            await user.merge(updatedFields).save();
            return user;
        }
        return null;
    }
    async updateLastLogin(id) {
        await this.User.query().where('id', id).update({ last_login: luxon_1.DateTime.now() }).first();
    }
    async updateInfo(id, data) {
        const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();
        const { about } = data;
        if (user) {
            await user.merge({ about }).save();
            return { about: user.about };
        }
        return null;
    }
    async updateRoles(user, roles) {
        await user.related('roles').detach();
        await user.related('roles').attach(roles.map(role => role.id));
        await user.load('roles');
        return user.roles.map(role => role);
    }
    async delete(id) {
        const user = await this.User.query().preload('contacts').preload('roles').where('id', id).first();
        if (user) {
            await user.delete();
            return user;
        }
        return null;
    }
    async updatePassword(password, id) {
        const hashedPass = await Hash_1.default.make(password);
        return this.User.query().where('id', id).update({ password: hashedPass }).first();
    }
}
exports.default = UserRepository;
//# sourceMappingURL=UserRepository.js.map