import Factory from '@ioc:Adonis/Lucid/Factory';
import { string } from '@ioc:Adonis/Core/Helpers';

/**
 * Datatypes
 */
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';

/**
 * Models
 */
import Category from 'App/Models/Category';
import Contact from 'App/Models/Contact';
import Course from 'App/Models/Course';
import Lesson from 'App/Models/Lesson';
import LessonContent from 'App/Models/LessonContent';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import { DateTime } from 'luxon';

const makeFakeUser = (faker: Faker.FakerStatic, loginPrefix?: string) => {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    login: `${loginPrefix || 'user'}-${string.generateRandom(5)}`,
    email: faker.internet.exampleEmail(),
    password: '123456',
  };
};

export const ContactFactory = Factory.define(Contact, ({ faker }) => {
  return {
    phone_number: faker.phone.phoneNumber(),
  };
}).build();

export const UserFactory = Factory.define(User, ({ faker }) => makeFakeUser(faker))
  .relation('contacts', () => ContactFactory)
  .build();

export const TeacherFactory = Factory.define(User, ({ faker }) => makeFakeUser(faker, 'teacher'))
  .relation('contacts', () => ContactFactory)
  .after('create', async (_, user: User) => {
    const role = await Role.findByOrFail('slug', 'teacher');
    await user.related('roles').attach([role.id]);
  })
  .build();

export const StudentFactory = Factory.define(User, ({ faker }) => makeFakeUser(faker, 'student'))
  .relation('contacts', () => ContactFactory)
  .after('create', async (_, user: User) => {
    const role = await Role.findByOrFail('slug', 'student');
    await user.related('roles').attach([role.id]);
  })
  .build();

export const LessonContentFactory = Factory.define(LessonContent, ({ faker }) => {
  return {
    video_url: `https://www.youtube.com/embed/${faker.datatype.string(10)}`,
  };
}).build();

export const LessonFactory = Factory.define(Lesson, ({ faker }) => {
  return {
    title: faker.lorem.sentence(6),
    description: faker.lorem.sentence(7),
    display_order: 1,
    duration: DateTime.fromObject({
      hour: faker.datatype.number(2),
      minute: faker.datatype.number({ min: 30, max: 59 }),
      second: 0,
    }).toFormat('HH:mm:ss'),
    color_id: faker.datatype.number({ min: 1, max: 25 }),
  };
})
  .relation('content', () => LessonContentFactory)
  .build();

export const CategoryFactory = Factory.define(Category, ({ faker }) => {
  return {
    title: `Category #${faker.datatype.number(200)}`,
    description: faker.lorem.sentence(5),
  };
}).build();

export const CourseFactory = Factory.define(Course, ({ faker }) => {
  return {
    title: faker.lorem.sentence(8),
    description: faker.lorem.sentence(20),
    status: CourseStatusEnum.PUBLISHED,
  };
})
  .relation('category', () => CategoryFactory)
  .relation('lessons', () => LessonFactory)
  .relation('teacher', () => TeacherFactory)
  .build();
