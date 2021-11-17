/* eslint-disable import/no-cycle */
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Lesson from './Lesson';
import LessonMaterial from './LessonMaterial';

export default class LessonContent extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public lesson_id: string;

  @column()
  public video_url: string;

  @hasMany(() => LessonMaterial, { foreignKey: 'lesson_content_id' })
  public materials: HasMany<typeof LessonMaterial>;

  @belongsTo(() => Lesson, { foreignKey: 'lesson_id' })
  public lesson: BelongsTo<typeof Lesson>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
