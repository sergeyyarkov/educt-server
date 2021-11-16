import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
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

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
