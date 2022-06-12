"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Image_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Image"));
class ImageRepository {
    constructor() {
        Object.defineProperty(this, "Image", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Image = Image_1.default;
    }
    async getById(id) {
        const image = await this.Image.query().where('id', id).first();
        return image;
    }
    async getByFileName(name) {
        const image = await this.Image.query().where('name', name).first();
        return image;
    }
    async getAll() {
        const images = await this.Image.query();
        return images;
    }
    async create({ file, location }) {
        await file.moveToDisk(location);
        const image = await this.Image.create({ name: file.fileName, path: file.filePath, ext: file.extname });
        return image;
    }
    async delete(id) {
        const image = await this.Image.query().where('id', id).first();
        if (image) {
            await Drive_1.default.delete(image.path);
            await image.delete();
            return image;
        }
        return null;
    }
}
exports.default = ImageRepository;
//# sourceMappingURL=ImageRepository.js.map