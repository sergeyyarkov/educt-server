/**
 * Models
 */
import Course from 'App/Models/Course';
import Lesson from 'App/Models/Lesson';

/**
 * Validators
 */
import CreateLessonValidator from 'App/Validators/Lesson/CreateLessonValidator';
import UpdateLessonValidator from 'App/Validators/Lesson/UpdateLessonValidator';

export default class LessonRepository {
  private Lesson: typeof Lesson;

  constructor() {
    this.Lesson = Lesson;
  }

  /**
   * Get all lessons
   *
   * @returns Lessons
   */
  public async getAll(): Promise<Lesson[]> {
    const lessons = await this.Lesson.query();
    return lessons;
  }

  /**
   * Get one lesson by id
   *
   * @param id Lesson id
   * @returns Lesson or null
   */
  public async getById(id: string | number): Promise<Lesson | null> {
    const lesson = await this.Lesson.query().where('id', id).first();
    return lesson;
  }

  /**
   * Get content of lesson by id
   *
   * @param id Lesson id
   * @returns Content of lesson or null
   */
  public async getContentById(id: string | number): Promise<Lesson['content'] | null> {
    const lesson = await this.Lesson.query().preload('content').where('id', id).first();
    return lesson && lesson.content;
  }

  /**
   * Create lesson
   *
   * @param course Course of lesson
   * @returns Lesson
   */
  public async create(course: Course, data: CreateLessonValidator['schema']['props']): Promise<Lesson> {
    const lesson = await this.Lesson.create({
      title: data.title,
      description: data.description,
    });

    /**
     * Attach lesson to course
     */
    await lesson.related('course').associate(course);

    /**
     * Create content and materials fields in database
     */
    const content = await lesson.related('content').create({ video_url: data.video_url });

    if (data.materials) {
      await Promise.all(
        data.materials.map(async file => {
          /**
           * Move each file to disk and then save in database
           */
          await file.moveToDisk('materials');
          if (file.state === 'moved') {
            await content.related('materials').create({
              name: file.clientName,
              ext: file.extname,
              url: file.filePath,
            });
          }
        })
      );
    }

    /**
     * Load data
     */
    await lesson.load('content', q => q.preload('materials'));

    return lesson;
  }

  /**
   * Update lesson
   *
   * @param id Lesson id
   * @returns Updated lesson
   */
  public async update(id: string | number, data: UpdateLessonValidator['schema']['props']): Promise<Lesson | null> {
    const lesson = await this.Lesson.query().where('id', id).first();

    if (lesson) {
      await lesson
        .merge({
          course_id: data.course_id,
          title: data.title,
          description: data.description,
        })
        .save();

      return lesson;
    }
    return null;
  }

  /**
   * Delete lesson
   *
   * @param id Lesson id
   * @returns Deleted lesson or null
   */
  public async delete(id: string | number): Promise<Lesson | null> {
    const lesson = await this.Lesson.query().where('id', id).first();

    if (lesson) {
      await lesson.delete();
      return lesson;
    }

    return null;
  }
}
