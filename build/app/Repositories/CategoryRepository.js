"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Category"));
class CategoryRepository {
    constructor() {
        Object.defineProperty(this, "Category", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Category = Category_1.default;
    }
    async getAll() {
        const categories = await this.Category.query().preload('color');
        return categories;
    }
    async getById(id) {
        const category = await this.Category.query().preload('color').where('id', id).first();
        return category;
    }
    async create(data) {
        const category = await this.Category.create({
            title: data.title,
            description: data.description,
        });
        return category;
    }
    async delete(id) {
        const category = await this.Category.query().where('id', id).first();
        if (category) {
            await category.delete();
            return category;
        }
        return null;
    }
    async update(id, data) {
        const category = await this.Category.query().where('id', id).first();
        if (category) {
            await category.merge(data).save();
            return category;
        }
        return null;
    }
}
exports.default = CategoryRepository;
//# sourceMappingURL=CategoryRepository.js.map