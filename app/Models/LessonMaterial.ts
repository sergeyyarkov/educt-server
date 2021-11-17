import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
// eslint-disable-next-line import/no-cycle
import LessonContent from './LessonContent';

export default class LessonMaterial extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public url: string;

  @column()
  public name: string;

  @column()
  public clientName: string;

  @column()
  public ext: string;

  @column()
  public lesson_content_id: number;

  @belongsTo(() => LessonContent, {
    foreignKey: 'lesson_content_id',
  })
  public content: BelongsTo<typeof LessonContent>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
