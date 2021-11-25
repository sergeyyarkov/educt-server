/* eslint-disable no-param-reassign */
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import ColorHelper from 'App/Helpers/ColorHelper';
import Course from './Course';
// eslint-disable-next-line import/no-cycle
import LessonContent from './LessonContent';
import Color from './Color';

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public course_id: string;

  @column()
  public title: string;

  @column({ serializeAs: null })
  public display_order: number;

  @column()
  public description: string;

  @column()
  public duration: string;

  @belongsTo(() => Course, {
    foreignKey: 'course_id',
  })
  public course: BelongsTo<typeof Course>;

  @column({ serializeAs: null })
  public color_id: number | null;

  @belongsTo(() => Color, {
    foreignKey: 'color_id',
  })
  public color: BelongsTo<typeof Color>;

  @hasOne(() => LessonContent, {
    foreignKey: 'lesson_id',
  })
  public content: HasOne<typeof LessonContent>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /**
   * Assign id to lesson by nanoid.
   * @param lesson Lesson
   */
  @beforeCreate()
  public static assignLessonId(lesson: Lesson) {
    lesson.id = nanoid();
  }

  @beforeCreate()
  public static async assignRandomColor(course: Course) {
    const color = await ColorHelper.generateRandomColor();

    if (color) {
      course.color_id = color.id;
    }
  }
}
