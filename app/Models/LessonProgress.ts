/* eslint-disable import/no-cycle */
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Lesson from './Lesson';
import User from './User';

export default class LessonProgress extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public lesson_id: string;

  @column({ serializeAs: null })
  public user_id: string;

  @column()
  public is_watched: boolean;

  @belongsTo(() => Lesson, {
    foreignKey: 'lesson_id',
  })
  public lesson: BelongsTo<typeof Lesson>;

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>;
}
