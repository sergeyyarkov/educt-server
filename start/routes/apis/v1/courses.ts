import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', 'Api/v1/CoursesController.list').middleware('role:admin,teacher,student').as('courses.list');
  Route.post('/', 'Api/v1/CoursesController.create').middleware('role:admin,teacher').as('courses.create');
  Route.get('/:id', 'Api/v1/CoursesController.show').middleware('role:admin,teacher,student').as('courses.show');
  Route.delete('/:id', 'Api/v1/CoursesController.delete').middleware('role:admin,teacher').as('courses.delete');
  Route.patch('/:id', 'Api/v1/CoursesController.update').middleware('role:admin,teacher').as('courses.update');
  Route.get('/:id/teacher', 'Api/v1/CoursesController.showTeacher')
    .middleware('role:admin,teacher,student')
    .as('courses.show-teacher');

  Route.get('/:id/category', 'Api/v1/CoursesController.showCategory')
    .middleware('role:admin,teacher,student')
    .as('courses.show-category');

  Route.get('/:id/lessons', 'Api/v1/CoursesController.showLessons')
    .middleware('role:admin,teacher,student')
    .as('courses.show-lessons');

  Route.get('/:id/students', 'Api/v1/CoursesController.showStudents')
    .middleware('role:admin,teacher,student')
    .as('courses.show-students');

  Route.get('/:id/students/count', 'Api/v1/CoursesController.studentsCount')
    .middleware('role:admin,teacher,student')
    .as('courses.students-count');

  Route.post('/:id/attach-student', 'Api/v1/CoursesController.attachStudent')
    .middleware('role:admin,teacher')
    .as('courses.attach-student');

  Route.post('/:id/attach-student-list', 'Api/v1/CoursesController.attachStudentList')
    .middleware('role:admin,teacher')
    .as('courses.attach-student-list');

  Route.patch('/:id/detach-student-list', 'Api/v1/CoursesController.detachStudentList')
    .middleware('role:admin,teacher')
    .as('courses.detach-student-list');

  Route.delete('/:id/detach-student', 'Api/v1/CoursesController.detachStudent')
    .middleware('role:admin,teacher')
    .as('courses.detach-student');

  Route.get('/:id/likes', 'Api/v1/CoursesController.showLikes')
    .middleware('role:admin,teacher,student')
    .as('courses.show-likes');

  Route.put('/:id/likes', 'Api/v1/CoursesController.setLike')
    .middleware('role:admin,teacher,student')
    .as('courses.set-like');

  Route.delete('/:id/likes', 'Api/v1/CoursesController.unsetLike')
    .middleware('role:admin,teacher,student')
    .as('courses.unset-like');

  Route.post('/:id/set-status', 'Api/v1/CoursesController.setStatus')
    .middleware('role:admin,teacher')
    .as('courses.set-status');

  Route.get('/:id/lessons-progress', 'Api/v1/CoursesController.getLessonsProgress')
    .middleware('role:admin,teacher,student')
    .as('courses.get-lessons-progress');
})
  .prefix('v1/courses')
  .middleware('auth');
