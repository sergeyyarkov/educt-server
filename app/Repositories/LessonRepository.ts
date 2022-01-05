import Drive from '@ioc:Adonis/Core/Drive';
import { cuid } from '@ioc:Adonis/Core/Helpers';

/**
 * Models
 */
import Course from 'App/Models/Course';
import Lesson from 'App/Models/Lesson';
import LessonMaterial from 'App/Models/LessonMaterial';
import LessonVideo from 'App/Models/LessonVideo';

/**
 * Validators
 */
import CreateLessonValidator from 'App/Validators/Lesson/CreateLessonValidator';
import UpdateLessonValidator from 'App/Validators/Lesson/UpdateLessonValidator';

export default class LessonRepository {
  private Lesson: typeof Lesson;

  private LessonMaterial: typeof LessonMaterial;

  private LessonVideo: typeof LessonVideo;

  private Drive: typeof Drive;

  constructor() {
    this.Lesson = Lesson;
    this.LessonMaterial = LessonMaterial;
    this.LessonVideo = LessonVideo;
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
   * Get lesson material by name
   *
   * @param fileName Name of file
   * @returns Lesson material or null
   */
  public async getMaterialFileByName(fileName: string): Promise<LessonMaterial | null> {
    const material = await this.LessonMaterial.query().where('name', fileName).first();
    return material;
  }

  /**
   * Get lesson material by id
   *
   * @param id Material id
   * @returns Lesson material or null
   */
  public async getMaterialFileById(id: number): Promise<LessonMaterial | null> {
    const material = await this.LessonMaterial.query().where('id', id).first();
    return material;
  }

  public async getVideoFileByName(fileName: string): Promise<LessonVideo | null> {
    const video = await this.LessonVideo.query().where('name', fileName).first();
    return video;
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
      course_id: course.id,
    });

    /**
     * Create content
     */
    await lesson.related('content').create({ body: '' });

    /**
     * Move video file to disk and save to database
     */
    const videoName = `${cuid()}.${data.video.extname}`;
    await data.video.moveToDisk('videos', { name: videoName });
    if (data.video.state === 'moved') {
      await lesson.related('video').create({
        name: videoName,
        clientName: data.video.clientName,
        ext: data.video.extname,
        size: data.video.size,
        url: `/video/${videoName}`,
      });
    }

    /**
     * Create materials
     */
    if (data.materials) {
      /**
       * Move each file to disk
       */
      const files = await Promise.all(
        data.materials.map(async file => {
          const name = `${cuid()}.${file.extname}`;
          await file.moveToDisk('materials', { name });
          return { file, name };
        })
      );

      /**
       * Create lesson material
       */
      const materials = await Promise.all(
        files.map(async ({ file, name }) => {
          if (file.state === 'moved' && file.fileName && file.extname) {
            const material = new LessonMaterial();

            material.name = name;
            material.size = file.size;
            material.clientName = file.clientName;
            material.ext = file.extname;

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
    await lesson.load(loader => loader.load('content').load('materials').load('video').load('progress'));

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
    const lesson = await this.Lesson.query()
      .where('id', id)
      .preload('video')
      .preload('materials')
      .preload('color')
      .first();

    if (lesson) {
      /**
       * Delete files from disk
       */
      await this.Drive.delete(`videos/${lesson.video.name}`);
      await Promise.all(
        lesson.materials.map(async material => {
          await this.Drive.delete(`materials/${material.name}`);
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
