"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const ImageRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/ImageRepository"));
let ImageService = class ImageService {
    constructor(imageRepository) {
        Object.defineProperty(this, "imageRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.imageRepository = imageRepository;
    }
    async fetchImages() {
        const images = await this.imageRepository.getAll();
        return {
            success: true,
            message: 'Fetched all images.',
            status: HttpStatusEnum_1.default.OK,
            data: images,
        };
    }
    async fetchImage(id) {
        const image = await this.imageRepository.getById(id);
        if (!image) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Image not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            message: 'Fetched image.',
            status: HttpStatusEnum_1.default.OK,
            data: image,
        };
    }
    async createImage(data) {
        const image = await this.imageRepository.create({ file: data.image, location: 'images' });
        return {
            success: true,
            message: 'Image created.',
            status: HttpStatusEnum_1.default.OK,
            data: image,
        };
    }
    async deleteImage(id) {
        const image = await this.imageRepository.delete(id);
        if (!image) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Image not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            message: 'Image deleted.',
            status: HttpStatusEnum_1.default.OK,
            data: image,
        };
    }
};
ImageService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [ImageRepository_1.default])
], ImageService);
exports.default = ImageService;
new standalone_1.Ioc().make(ImageService);
//# sourceMappingURL=ImageService.js.map