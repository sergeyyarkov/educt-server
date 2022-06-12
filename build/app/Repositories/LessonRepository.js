"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Lesson_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Lesson"));
const LessonMaterial_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LessonMaterial"));
const LessonVideo_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LessonVideo"));
class LessonRepository {
    constructor() {
        Object.defineProperty(this, "Lesson", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "LessonMaterial", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "LessonVideo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "Drive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.Lesson = Lesson_1.default;
        this.LessonMaterial = LessonMaterial_1.default;
        this.LessonVideo = LessonVideo_1.default;
        this.Drive = Drive_1.default;
    }
    async getAll() {
        const lessons = await this.Lesson.query();
        return lessons;
    }
    async getById(id) {
        const lesson = await this.Lesson.query().where('id', id).preload('color').withCount('materials').first();
        return lesson;
    }
    async getContentById(id) {
        const lesson = await this.Lesson.query().preload('content').where('id', id).first();
        return lesson && lesson.content;
    }
    async getMaterialFileByName(fileName) {
        const material = await this.LessonMaterial.query().where('name', fileName).first();
        return material;
    }
    async getMaterialFileById(id) {
        const material = await this.LessonMaterial.query().where('id', id).first();
        return material;
    }
    async getVideoFileByName(fileName) {
        const video = await this.LessonVideo.query().where('name', fileName).first();
        return video;
    }
    async create(course, data) {
        await course.loadCount('lessons');
        const lesson = await this.Lesson.create({
            title: data.title,
            description: data.description,
            duration: data.duration.toFormat('HH:mm:ss'),
            display_order: Number.parseInt(course.$extras.lessons_count, 10) + 1,
            course_id: course.id,
            linked_video_url: !data.video ? data.linked_video_url : null,
        });
        await lesson.related('content').create({ body: '' });
        if (data.video) {
            await this.createVideo(lesson, data.video);
        }
        if (data.materials) {
            await this.createMaterials(lesson, data.materials);
        }
        await lesson.load(loader => loader.load('content').load('materials').load('video').load('progress'));
        return lesson;
    }
    async update(id, data) {
        const lesson = await this.Lesson.query().preload('video').preload('color').where('id', id).first();
        if (lesson) {
            lesson.merge({
                title: data.title,
                description: data.description,
                course_id: data.course_id,
                ...(data.duration && { duration: data.duration.toFormat('HH:mm:ss') }),
            });
            if (data.linked_video_url && !data.video) {
                if (lesson.video) {
                    await this.Drive.delete(`videos/${lesson.video.name}`);
                }
                await lesson.related('video').query().delete();
                lesson.merge({ linked_video_url: data.linked_video_url });
            }
            if (data.video) {
                if (lesson.video) {
                    await this.Drive.delete(`videos/${lesson.video.name}`);
                }
                await lesson.related('video').query().delete();
                await this.createVideo(lesson, data.video);
                lesson.merge({ linked_video_url: null });
            }
            if (data.materials && data.materials !== null) {
                await this.deleteMaterials(lesson);
                await this.createMaterials(lesson, data.materials);
            }
            else if (data.materials === null)
                await this.deleteMaterials(lesson);
            await lesson.load(loader => loader.load('video').load('materials'));
            await lesson.save();
            return lesson;
        }
        return null;
    }
    async delete(id) {
        const lesson = await this.Lesson.query().where('id', id).preload('video').preload('color').first();
        if (lesson) {
            if (lesson.video) {
                await this.Drive.delete(`videos/${lesson.video.name}`);
            }
            await this.deleteMaterials(lesson);
            await lesson.delete();
            return lesson;
        }
        return null;
    }
    async createVideo(lesson, video) {
        const videoName = `${(0, Helpers_1.cuid)()}.${video.extname}`;
        await video.moveToDisk('videos', { name: videoName });
        if (video.state === 'moved') {
            await lesson.related('video').create({
                name: videoName,
                clientName: video.clientName,
                ext: video.extname,
                size: video.size,
                url: `/video/${videoName}`,
            });
        }
    }
    async createMaterials(lesson, materials) {
        const files = await Promise.all(materials.map(async (file) => {
            const name = `${(0, Helpers_1.cuid)()}.${file.extname}`;
            await file.moveToDisk('materials', { name });
            return { file, name };
        }));
        const promises = await Promise.all(files.map(async ({ file, name }) => {
            if (file.state === 'moved' && file.fileName && file.extname) {
                const material = new LessonMaterial_1.default();
                material.name = name;
                material.size = file.size;
                material.clientName = file.clientName;
                material.ext = file.extname;
                return material;
            }
            return null;
        }));
        await lesson.related('materials').createMany(promises.filter((l) => l !== null));
    }
    async deleteMaterials(lesson) {
        await lesson.load('materials');
        await Promise.all(lesson.materials.map(async (material) => {
            await this.Drive.delete(`materials/${material.name}`);
            await material.delete();
        }));
    }
}
exports.default = LessonRepository;
//# sourceMappingURL=LessonRepository.js.map