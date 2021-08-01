import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'CoursesController.list').middleware('role:admin,teacher,student').as('courses.list');
  Route.post('/', 'CoursesController.create').middleware('role:admin,teacher').as('courses.create');
  Route.get('/:id', 'CoursesController.show').middleware('role:admin,teacher,student').as('courses.show');
  Route.delete('/:id', 'CoursesController.delete').middleware('role:admin,teacher').as('courses.delete');
  Route.patch('/:id', 'CoursesController.update').middleware('role:admin,teacher').as('courses.update');
  Route.get('/:id/teacher', 'CoursesController.showTeacher')
    .middleware('role:admin,teacher,student')
    .as('courses.show-teacher');

  Route.get('/:id/category', 'CoursesController.showCategory')
    .middleware('role:admin,teacher,student')
    .as('courses.show-category');

  Route.get('/:id/lessons', 'CoursesController.showLessons')
    .middleware('role:admin,teacher,student')
    .as('courses.show-lessons');

  Route.get('/:id/students', 'CoursesController.showStudents')
    .middleware('role:admin,teacher,student')
    .as('courses.show-students');

  Route.post('/:id/attach-student', 'CoursesController.attachStudent')
    .middleware('role:admin,teacher')
    .as('courses.attach-student');

  Route.delete('/:id/detach-student', 'CoursesController.detachStudent')
    .middleware('role:admin,teacher')
    .as('courses.detach-student');
}).prefix('courses');
