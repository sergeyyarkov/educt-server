/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm';

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public title: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  /**
   * Assign id to category by nanoid.
   * @param category Category
   */
  @beforeCreate()
  public static assignCategoryId(category: Category) {
    category.id = nanoid();
  }
}
