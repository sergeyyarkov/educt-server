import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

export default class LessonMaterial extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public url: string;

  @column()
  public name: string;

  @column()
  public ext: string;

  @column()
  public lesson_content_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
