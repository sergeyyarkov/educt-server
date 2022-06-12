"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contact_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Contact"));
class ContactRepository {
    constructor() {
        Object.defineProperty(this, "Contact", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Contact = Contact_1.default;
    }
    async getByUser(userId) {
        const contacts = await this.Contact.query().where('user_id', userId).first();
        return contacts;
    }
    async create(user, data) {
        const contacts = await this.Contact.create(data);
        await contacts.related('user').associate(user);
        await user.load('contacts');
        await user.load('roles');
        return contacts;
    }
    async update(user, data) {
        const contacts = await this.Contact.query().where('user_id', user.id).first();
        if (contacts) {
            await contacts.merge(data).save();
            await user.load('contacts');
            return contacts;
        }
        return null;
    }
}
exports.default = ContactRepository;
//# sourceMappingURL=ContactRepository.js.map