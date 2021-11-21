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
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite';
import ColorHelper from 'App/Helpers/ColorHelper';
import Category from 'App/Models/Category';
import Lesson from 'App/Models/Lesson';
import User from 'App/Models/User';
import CourseStatusEnum from 'App/Datatypes/Enums/CourseStatusEnum';
import Color from './Color';

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @attachment({ folder: 'images/courses', preComputeUrl: true })
  public image: AttachmentContract | null;

  @column()
  public title: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public teacher_id: string;

  @column({ serializeAs: null })
  public category_id: string;

  @column({ serializeAs: null })
  public color_id: number | null;

  @belongsTo(() => Color, {
    foreignKey: 'color_id',
  })
  public color: BelongsTo<typeof Color>;

  @column()
  public status: CourseStatusEnum;

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

  @beforeCreate()
  public static async assignRandomColor(course: Course) {
    const color = await ColorHelper.generateRandomColor();

    if (color) {
      course.color_id = color.id;
    }
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
