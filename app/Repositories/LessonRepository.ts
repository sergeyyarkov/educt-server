import Drive from '@ioc:Adonis/Core/Drive';

/**
 * Models
 */
import Course from 'App/Models/Course';
import Lesson from 'App/Models/Lesson';
import LessonMaterial from 'App/Models/LessonMaterial';

/**
 * Validators
 */
import CreateLessonValidator from 'App/Validators/Lesson/CreateLessonValidator';
import UpdateLessonValidator from 'App/Validators/Lesson/UpdateLessonValidator';

export default class LessonRepository {
  private Lesson: typeof Lesson;

  private LessonMaterial: typeof LessonMaterial;

  private Drive: typeof Drive;

  constructor() {
    this.Lesson = Lesson;
    this.LessonMaterial = LessonMaterial;
    this.Drive = Drive;
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
    const lesson = await this.Lesson.query().where('id', id).preload('color').withCount('materials').first();
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
   * Get lesson material
   *
   * @param fileName Name of file
   * @returns Lesson material file or null
   */
  public async getMaterialFileByName(fileName: string): Promise<LessonMaterial | null> {
    const material = await this.LessonMaterial.query().where('name', fileName).first();
    return material;
  }

  /**
   * Create lesson
   *
   * @param course Course of lesson
   * @returns Lesson
   */
  public async create(course: Course, data: CreateLessonValidator['schema']['props']): Promise<Lesson> {
    await course.loadCount('lessons');

    const lesson = await this.Lesson.create({
      title: data.title,
      description: data.description,
      duration: data.duration.toFormat('HH:mm:ss'),
      display_order: Number.parseInt(course.$extras.lessons_count, 10) + 1,
    });

    /**
     * Attach lesson to course
     */
    await lesson.related('course').associate(course);

    /**
     * Create content
     */
    await lesson.related('content').create({ video_url: data.video_url });

    /**
     * Create materials
     */
    if (data.materials) {
      /**
       * Move each file to disk
       */
      const files = await Promise.all(
        data.materials.map(async file => {
          await file.moveToDisk('materials');
          return file;
        })
      );

      /**
       * Create lesson material
       */
      const materials = await Promise.all(
        files.map(async file => {
          if (file.state === 'moved' && file.fileName && file.extname) {
            const url = await this.Drive.getUrl(`materials/${file.fileName}`);
            const material = new LessonMaterial();

            material.name = file.fileName;
            material.size = file.size;
            material.clientName = file.clientName;
            material.ext = file.extname;
            material.url = url;

            return material;
          }

          return null;
        })
      );

      /**
       * Save lesson materials to database
       */
      await lesson.related('materials').createMany(materials.filter((l): l is LessonMaterial => l !== null));
    }
    /**
     * Load data
     */
    await lesson.load(loader => loader.load('content').load('materials'));

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
    const lesson = await this.Lesson.query().where('id', id).preload('materials').preload('color').first();

    if (lesson) {
      /**
       * Delete files from disk
       */
      await Promise.all(
        lesson.materials.map(async file => {
          await this.Drive.delete(`materials/${file.name}`);
        })
      );

      /**
       * Delete lesson from database
       */
      await lesson.delete();
      return lesson;
    }

    return null;
  }
}
