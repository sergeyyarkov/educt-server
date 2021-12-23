/* eslint-disable import/no-cycle */
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Lesson from './Lesson';

export default class LessonMaterial extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public size: number;

  @column()
  public clientName: string;

  @column()
  public ext: string;

  @column()
  public lesson_id: string;

  @belongsTo(() => Lesson, {
    foreignKey: 'lesson_id',
  })
  public lesson: BelongsTo<typeof Lesson>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
