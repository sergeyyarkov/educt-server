/* eslint-disable no-param-reassign */
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm';

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public course_id: string;

  @column()
  public title: string;

  @column()
  public description: string;

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
