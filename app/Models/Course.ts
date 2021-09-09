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
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';
import Image from './Image';

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column({ serializeAs: null })
  public bg_image_id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public teacher_id: string;

  @column({ serializeAs: null })
  public category_id: string;

  @column({ serializeAs: null })
  public status: CourseStatusEnum;

  @belongsTo(() => Category, {
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof Category>;

  @belongsTo(() => Image, {
    foreignKey: 'bg_image_id',
  })
  public image: BelongsTo<typeof Image>;

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

  /**
   * Serialize the `$extras` object
   */
  public serializeExtras() {
    return {
      students_count: this.$extras.students_count,
      likes_count: this.$extras.likes_count,
      lessons_count: this.$extras.lessons_count,
    };
  }
}
