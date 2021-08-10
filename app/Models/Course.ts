// eslint-disable-next-line import/no-cycle
/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Category from 'App/Models/Category';
import Lesson from 'App/Models/Lesson';
import User from 'App/Models/User';

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
  public category_id: string;

  @belongsTo(() => Category, {
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof Category>;

  @belongsTo(() => User, {
    foreignKey: 'teacher_id',
  })
  public teacher: BelongsTo<typeof User>;

  @hasMany(() => Lesson, {
    foreignKey: 'course_id',
  })
  public lessons: HasMany<typeof Lesson>;

  @manyToMany(() => User, {
    pivotTable: 'users_courses',
  })
  public students: ManyToMany<typeof User>;

  @manyToMany(() => User, {
    pivotTable: 'courses_likes',
    pivotTimestamps: {
      createdAt: 'liked_on',
      updatedAt: false,
    },
    pivotColumns: ['liked_on'],
  })
  public likes: ManyToMany<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /**
   * Assign id to course by nanoid.
   * @param course Course
   */
  @beforeCreate()
  public static assignCourseId(course: Course) {
    course.id = nanoid();
  }
}
