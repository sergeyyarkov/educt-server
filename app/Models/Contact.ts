import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({ serializeAs: null })
  public user_id: string;

  @column()
  public email: string;

  @column()
  public phone_number: string | null;

  @column()
  public vk_id: string | null;

  @column()
  public twitter_id: string | null;

  @column()
  public telegram_id: string | null;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;
}
