import Factory from '@ioc:Adonis/Lucid/Factory';
import Category from 'App/Models/Category';
import Contact from 'App/Models/Contact';
import Course from 'App/Models/Course';
import Lesson from 'App/Models/Lesson';
import User from 'App/Models/User';

export const ContactFactory = Factory.define(Contact, ({ faker }) => {
  return {
    email: faker.internet.exampleEmail(),
  };
}).build();

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    login: `${faker.lorem.word(6)}${faker.datatype.number(10)}`,
    password: faker.internet.password(6),
  };
})
  .relation('contacts', () => ContactFactory)
  .build();

export const LessonFactory = Factory.define(Lesson, ({ faker }) => {
  return {
    title: faker.lorem.sentence(2),
    description: faker.lorem.sentence(5),
  };
}).build();

export const CategoryFactory = Factory.define(Category, ({ faker }) => {
  const title = faker.lorem.word(6);
  return {
    title: `${title[0].toUpperCase()}${title.slice(1)}`,
    description: faker.lorem.sentence(5),
  };
}).build();

export const CourseFactory = Factory.define(Course, ({ faker }) => {
  return {
    title: faker.lorem.sentence(3),
    description: faker.lorem.sentence(5),
  };
})
  .relation('category', () => CategoryFactory)
  .relation('lessons', () => LessonFactory)
  // .relation('teacher', () => UserFactory)
  .build();
