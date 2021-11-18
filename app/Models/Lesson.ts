/* eslint-disable no-param-reassign */
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import Course from './Course';
// eslint-disable-next-line import/no-cycle
import LessonContent from './LessonContent';

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public course_id: string;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public duration: string;

  @belongsTo(() => Course, {
    foreignKey: 'course_id',
  })
  public course: BelongsTo<typeof Course>;

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
}
