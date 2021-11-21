/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import ColorHelper from 'App/Helpers/ColorHelper';
import Color from './Color';

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public title: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public color_id: number | null;

  @belongsTo(() => Color, {
    foreignKey: 'color_id',
  })
  public color: BelongsTo<typeof Color>;

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

  @beforeCreate()
  public static async assignRandomColor(category: Category) {
    const color = await ColorHelper.generateRandomColor();

    if (color) {
      category.color_id = color.id;
    }
  }
}
