"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/', 'Api/v1/CoursesController.list').middleware('role:admin,teacher,student').as('courses.list');
    Route_1.default.post('/', 'Api/v1/CoursesController.create').middleware('role:admin,teacher').as('courses.create');
    Route_1.default.get('/:id', 'Api/v1/CoursesController.show').middleware('role:admin,teacher,student').as('courses.show');
    Route_1.default.delete('/:id', 'Api/v1/CoursesController.delete').middleware('role:admin,teacher').as('courses.delete');
    Route_1.default.patch('/:id', 'Api/v1/CoursesController.update').middleware('role:admin,teacher').as('courses.update');
    Route_1.default.get('/:id/teacher', 'Api/v1/CoursesController.showTeacher')
        .middleware('role:admin,teacher,student')
        .as('courses.show-teacher');
    Route_1.default.get('/:id/category', 'Api/v1/CoursesController.showCategory')
        .middleware('role:admin,teacher,student')
        .as('courses.show-category');
    Route_1.default.get('/:id/lessons', 'Api/v1/CoursesController.showLessons')
        .middleware('role:admin,teacher,student')
        .as('courses.show-lessons');
    Route_1.default.get('/:id/students', 'Api/v1/CoursesController.showStudents')
        .middleware('role:admin,teacher,student')
        .as('courses.show-students');
    Route_1.default.get('/:id/students/count', 'Api/v1/CoursesController.studentsCount')
        .middleware('role:admin,teacher,student')
        .as('courses.students-count');
    Route_1.default.post('/:id/attach-student', 'Api/v1/CoursesController.attachStudent')
        .middleware('role:admin,teacher')
        .as('courses.attach-student');
    Route_1.default.post('/:id/attach-student-list', 'Api/v1/CoursesController.attachStudentList')
        .middleware('role:admin,teacher')
        .as('courses.attach-student-list');
    Route_1.default.patch('/:id/detach-student-list', 'Api/v1/CoursesController.detachStudentList')
        .middleware('role:admin,teacher')
        .as('courses.detach-student-list');
    Route_1.default.delete('/:id/detach-student', 'Api/v1/CoursesController.detachStudent')
        .middleware('role:admin,teacher')
        .as('courses.detach-student');
    Route_1.default.get('/:id/likes', 'Api/v1/CoursesController.showLikes')
        .middleware('role:admin,teacher,student')
        .as('courses.show-likes');
    Route_1.default.put('/:id/likes', 'Api/v1/CoursesController.setLike')
        .middleware('role:admin,teacher,student')
        .as('courses.set-like');
    Route_1.default.delete('/:id/likes', 'Api/v1/CoursesController.unsetLike')
        .middleware('role:admin,teacher,student')
        .as('courses.unset-like');
    Route_1.default.post('/:id/set-status', 'Api/v1/CoursesController.setStatus')
        .middleware('role:admin,teacher')
        .as('courses.set-status');
    Route_1.default.get('/:id/lessons-progress', 'Api/v1/CoursesController.getLessonsProgress')
        .middleware('role:admin,teacher,student')
        .as('courses.get-lessons-progress');
})
    .prefix('v1/courses')
    .middleware('auth');
//# sourceMappingURL=courses.js.map