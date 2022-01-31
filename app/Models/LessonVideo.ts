/* eslint-disable import/no-cycle */
import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Lesson from './Lesson';

export default class LessonVideo extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({ serializeAs: null })
  public lesson_id: string;

  @column()
  public name: string;

  @column()
  public size: number;

  @column()
  public clientName: string;

  @column()
  public ext: string;

  @column()
  public url: string;

  @belongsTo(() => Lesson, {
    foreignKey: 'lesson_id',
  })
  public lesson: BelongsTo<typeof Lesson>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
