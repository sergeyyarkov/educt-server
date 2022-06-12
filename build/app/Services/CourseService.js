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
const RoleEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/RoleEnum"));
const HttpStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/HttpStatusEnum"));
const RoleHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/RoleHelper"));
const CourseRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/CourseRepository"));
const UserRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/UserRepository"));
const CategoryRepository_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Repositories/CategoryRepository"));
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const CourseHelper_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Helpers/CourseHelper"));
let CourseService = class CourseService {
    constructor(courseRepository, userRepository, categoryRepository) {
        Object.defineProperty(this, "courseRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "userRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "categoryRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }
    async fetchCourses(params) {
        const data = await this.courseRepository.getAll(params);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched all courses.',
            data,
        };
    }
    async fetchCourse(id) {
        const data = await this.courseRepository.getById(id);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched course.',
            data,
        };
    }
    async fetchCourseTeacher(id) {
        const data = await this.courseRepository.getTeacher(id);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched course teacher.',
            data,
        };
    }
    async fetchCourseCategory(id) {
        const data = await this.courseRepository.getCategory(id);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched course category.',
            data,
        };
    }
    async fetchCourseLessons(id, ctx) {
        const user = await ctx.auth.use('api').authenticate();
        const data = await this.courseRepository.getLessons(id, user.id);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched course lessons.',
            data,
        };
    }
    async fetchCourseStudents(id) {
        const data = await this.courseRepository.getStudents(id);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched course students.',
            data,
        };
    }
    async fetchStudentsCount(id) {
        const count = await this.courseRepository.getStudentsCount(id);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched students count.',
            data: { count },
        };
    }
    async createCourse(data) {
        const user = await this.userRepository.getById(data.teacher_id);
        if (!user) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Teacher not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const isHasPermissions = RoleHelper_1.default.userContainRoles(user.roles, [RoleEnum_1.default.ADMIN, RoleEnum_1.default.TEACHER]);
        if (!isHasPermissions) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: `User with id "${user.id}" does not have sufficient permissions.`,
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        const category = await this.categoryRepository.getById(data.category_id);
        if (!category) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Category not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const course = await this.courseRepository.create(data);
        return {
            success: true,
            status: HttpStatusEnum_1.default.CREATED,
            message: 'Course created.',
            data: course,
        };
    }
    async deleteCourse(id) {
        const course = await this.courseRepository.delete(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await this.deleteAllFiles([course]);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Course deleted.',
            data: course,
        };
    }
    async updateCourse(id, data) {
        const course = await this.courseRepository.getById(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        if (data.teacher_id) {
            const teacher = await this.userRepository.getById(data.teacher_id);
            if (!teacher) {
                return {
                    success: false,
                    status: HttpStatusEnum_1.default.NOT_FOUND,
                    message: 'Teacher not found.',
                    data: {},
                    error: {
                        code: 'E_NOT_FOUND',
                    },
                };
            }
            await teacher.load('roles');
            const isTeacherOrAdmin = RoleHelper_1.default.userContainRoles(teacher.roles, [RoleEnum_1.default.ADMIN, RoleEnum_1.default.TEACHER]);
            if (!isTeacherOrAdmin) {
                return {
                    success: false,
                    status: HttpStatusEnum_1.default.BAD_REQUEST,
                    message: 'Author is not a teacher or admin.',
                    data: {},
                    error: {
                        code: 'E_BAD_REQUEST',
                    },
                };
            }
        }
        const updated = await this.courseRepository.update(id, data);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Course updated.',
            data: updated || {},
        };
    }
    async attachUserCourse(id, studentId) {
        const course = await this.courseRepository.getById(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const student = await this.userRepository.getById(studentId);
        if (!student) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Student not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const isStudent = RoleHelper_1.default.userHasRoles(student.roles, [RoleEnum_1.default.STUDENT]);
        if (!isStudent) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: `User cannot be added to the course without "${RoleEnum_1.default.STUDENT}" role.`,
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        try {
            await course.related('students').attach([student.id]);
        }
        catch (error) {
            if (error.code === '23505') {
                return {
                    success: false,
                    status: HttpStatusEnum_1.default.BAD_REQUEST,
                    message: 'Student already attached to that course.',
                    data: {},
                    error: {
                        code: 'E_BAD_REQUEST',
                    },
                };
            }
            throw new Error(error);
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Student attached.',
            data: {},
        };
    }
    async attachStudentList(id, ids) {
        const course = await this.courseRepository.getById(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const students = await this.userRepository.getByIds(ids);
        try {
            await course.related('students').attach(students.map(s => s.id));
        }
        catch (error) {
            if (error.code === '23505') {
                return {
                    success: false,
                    status: HttpStatusEnum_1.default.BAD_REQUEST,
                    message: 'Some student already attached to that course.',
                    data: {},
                    error: {
                        code: 'E_BAD_REQUEST',
                    },
                };
            }
            throw new Error(error);
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Student list successfully attached.',
            data: {},
        };
    }
    async detachStudentList(id, ids) {
        const course = await this.courseRepository.getById(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const students = await this.userRepository.getByIds(ids);
        try {
            await course.related('students').detach(students.map(s => s.id));
        }
        catch (error) {
            throw new Error(error);
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Student list successfully detached from course.',
            data: {},
        };
    }
    async detachUserCourse(id, studentId) {
        const course = await this.courseRepository.getById(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        const isAttached = course.students.find(student => student.id === studentId);
        if (!isAttached) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: 'Student not attached to that course.',
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        const student = await this.userRepository.getById(studentId);
        if (!student) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Student not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        await course.related('students').detach([student.id]);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Student detached.',
            data: {},
        };
    }
    async attachUserLike(id, auth) {
        const user = await auth.use('api').authenticate();
        const course = await this.courseRepository.getById(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        try {
            await course.related('likes').attach([user.id]);
        }
        catch (error) {
            if (error.code === '23505') {
                return {
                    success: false,
                    status: HttpStatusEnum_1.default.BAD_REQUEST,
                    message: 'You are already liked this course.',
                    data: {},
                    error: {
                        code: 'E_BAD_REQUEST',
                    },
                };
            }
            throw new Error(error);
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Like attached.',
            data: {},
        };
    }
    async detachUserLike(id, auth) {
        const user = await auth.use('api').authenticate();
        const course = await this.courseRepository.getById(id);
        if (!course) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.NOT_FOUND,
                message: 'Course not found.',
                data: {},
                error: {
                    code: 'E_NOT_FOUND',
                },
            };
        }
        try {
            await course.related('likes').detach([user.id]);
        }
        catch (error) {
            throw new Error(error);
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Like detached.',
            data: {},
        };
    }
    async setCourseStatus(id, status) {
        const data = await this.courseRepository.setStatus(id, status);
        if (!data) {
            return {
                success: false,
                status: HttpStatusEnum_1.default.BAD_REQUEST,
                message: `Cannot set status for course with id "${id}"`,
                data: {},
                error: {
                    code: 'E_BAD_REQUEST',
                },
            };
        }
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Status changed.',
            data: {},
        };
    }
    async fetchCourseLikesCount(id) {
        const count = await this.courseRepository.getLikesCount(id);
        return {
            success: true,
            status: HttpStatusEnum_1.default.OK,
            message: 'Fetched course likes count.',
            data: { count },
        };
    }
    async deleteAllFiles(courses) {
        const images = courses.map(course => CourseHelper_1.default.getImageFileName(course)).filter(Boolean);
        const videos = courses.flatMap(course => CourseHelper_1.default.getVideoFileNames(course)).filter(Boolean);
        const materials = courses.flatMap(course => CourseHelper_1.default.getMaterialFileNames(course));
        const promises = videos
            .concat(images, materials)
            .map(file => Drive_1.default.delete(`${file.path}${file.name.substring(file.name.lastIndexOf('/') + 1)}`));
        await Promise.all(promises);
    }
};
CourseService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [CourseRepository_1.default,
        UserRepository_1.default,
        CategoryRepository_1.default])
], CourseService);
exports.default = CourseService;
new standalone_1.Ioc().make(CourseService);
//# sourceMappingURL=CourseService.js.map