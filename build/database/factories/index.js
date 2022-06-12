"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseFactory = exports.CategoryFactory = exports.LessonFactory = exports.LessonContentFactory = exports.StudentFactory = exports.TeacherFactory = exports.UserFactory = exports.ContactFactory = void 0;
const Factory_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Factory"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const CourseStatusEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Datatypes/Enums/CourseStatusEnum"));
const Category_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Category"));
const Contact_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Contact"));
const Course_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Course"));
const Lesson_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Lesson"));
const LessonContent_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LessonContent"));
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const luxon_1 = require("luxon");
const makeFakeUser = (faker, loginPrefix) => {
    return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        login: `${loginPrefix || 'user'}-${Helpers_1.string.generateRandom(5)}`,
        email: faker.internet.exampleEmail(),
        password: '123456',
    };
};
exports.ContactFactory = Factory_1.default.define(Contact_1.default, ({ faker }) => {
    return {
        phone_number: faker.phone.phoneNumber(),
    };
}).build();
exports.UserFactory = Factory_1.default.define(User_1.default, ({ faker }) => makeFakeUser(faker))
    .relation('contacts', () => exports.ContactFactory)
    .build();
exports.TeacherFactory = Factory_1.default.define(User_1.default, ({ faker }) => makeFakeUser(faker, 'teacher'))
    .relation('contacts', () => exports.ContactFactory)
    .after('create', async (_, user) => {
    const role = await Role_1.default.findByOrFail('slug', 'teacher');
    await user.related('roles').attach([role.id]);
})
    .build();
exports.StudentFactory = Factory_1.default.define(User_1.default, ({ faker }) => makeFakeUser(faker, 'student'))
    .relation('contacts', () => exports.ContactFactory)
    .after('create', async (_, user) => {
    const role = await Role_1.default.findByOrFail('slug', 'student');
    await user.related('roles').attach([role.id]);
})
    .build();
exports.LessonContentFactory = Factory_1.default.define(LessonContent_1.default, ({ faker }) => {
    return {
        body: `${faker.lorem.sentences(40)}`,
    };
}).build();
exports.LessonFactory = Factory_1.default.define(Lesson_1.default, ({ faker }) => {
    return {
        title: faker.lorem.sentence(6),
        description: faker.lorem.sentence(7),
        display_order: 1,
        duration: luxon_1.DateTime.fromObject({
            hour: faker.datatype.number(2),
            minute: faker.datatype.number({ min: 30, max: 59 }),
            second: 0,
        }).toFormat('HH:mm:ss'),
        color_id: faker.datatype.number({ min: 1, max: 15 }),
    };
})
    .relation('content', () => exports.LessonContentFactory)
    .build();
exports.CategoryFactory = Factory_1.default.define(Category_1.default, ({ faker }) => {
    return {
        title: `Category #${faker.datatype.number(200)}`,
        description: faker.lorem.sentence(5),
    };
}).build();
exports.CourseFactory = Factory_1.default.define(Course_1.default, ({ faker }) => {
    return {
        title: faker.lorem.sentence(8),
        description: faker.lorem.sentence(20),
        education_description: faker.lorem.sentence(15),
        status: CourseStatusEnum_1.default.PUBLISHED,
    };
})
    .relation('category', () => exports.CategoryFactory)
    .relation('lessons', () => exports.LessonFactory)
    .relation('teacher', () => exports.TeacherFactory)
    .build();
//# sourceMappingURL=index.js.map