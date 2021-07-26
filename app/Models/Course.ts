/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import Category from './Category';

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public teacher_id: string;

  @column()
  public category_id: number;

  @hasOne(() => User)
  public teacher: HasOne<typeof User>;

  @hasOne(() => Category)
  public category: HasOne<typeof Category>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /**
   * Assign id to course by nanoid.
   * @param user User
   */
  @beforeCreate()
  public static assignCourseId(course: Course) {
    course.id = nanoid();
  }
}
