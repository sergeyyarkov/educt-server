"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CourseHelper {
    static getVideoFileNames(course) {
        const data = course.lessons.map(l => {
            if (!l.video)
                return null;
            return { path: 'videos/', name: l.video.name };
        });
        return data;
    }
    static getMaterialFileNames(course) {
        const data = course.lessons.flatMap(l => l.materials.map(m => ({ path: 'materials/', name: m.name })));
        return data;
    }
    static getImageFileName(course) {
        if (!course.image)
            return null;
        const data = { path: 'images/courses/', name: course.image.name };
        return data;
    }
}
exports.default = CourseHelper;
//# sourceMappingURL=CourseHelper.js.map