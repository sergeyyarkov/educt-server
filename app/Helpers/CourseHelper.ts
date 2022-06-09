import Course from 'App/Models/Course';

export type FileEntry = {
  path: string;
  name: string;
};

export default class CourseHelper {
  public static getVideoFileNames(course: Course): Array<FileEntry | null> {
    const data = course.lessons.map(l => {
      if (!l.video) return null;
      return { path: 'videos/', name: l.video.name };
    });

    return data;
  }

  public static getMaterialFileNames(course: Course): FileEntry[] {
    const data = course.lessons.flatMap(l => l.materials.map(m => ({ path: 'materials/', name: m.name })));
    return data;
  }

  public static getImageFileName(course: Course): FileEntry | null {
    if (!course.image) return null;
    const data = { path: 'images/courses/', name: course.image.name };
    return data;
  }
}
