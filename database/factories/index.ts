import Factory from '@ioc:Adonis/Lucid/Factory';

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
import User from 'App/Models/User';

export const ContactFactory = Factory.define(Contact, ({ faker }) => {
  return {
    phone_number: faker.phone.phoneNumber(),
  };
}).build();

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    login: `${faker.lorem.word(6)}${faker.datatype.number(10)}`,
    email: faker.internet.exampleEmail(),
    password: '12345',
  };
})
  .relation('contacts', () => ContactFactory)
  .build();

export const LessonContentFactory = Factory.define(LessonContent, ({ faker }) => {
  return {
    video_url: `https://www.youtube.com/embed/${faker.datatype.string(10)}`,
  };
}).build();

export const LessonFactory = Factory.define(Lesson, ({ faker }) => {
  return {
    title: `Lesson #${faker.datatype.number(200)}`,
    description: faker.lorem.sentence(5),
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
    title: `Course #${faker.datatype.number(200)}`,
    description: faker.lorem.sentence(5),
    status: CourseStatusEnum.PUBLISHED,
  };
})
  .relation('category', () => CategoryFactory)
  .relation('lessons', () => LessonFactory)
  // .relation('teacher', () => UserFactory)
  .build();
