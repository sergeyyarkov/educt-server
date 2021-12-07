/* eslint-disable import/no-cycle */
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Lesson from './Lesson';

export default class LessonContent extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public lesson_id: string;

  @column()
  public video_url: string;

  @belongsTo(() => Lesson, { foreignKey: 'lesson_id' })
  public lesson: BelongsTo<typeof Lesson>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
