import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import ColorEnum from 'App/Datatypes/Enums/ColorEnum';

export default class Color extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public hex: ColorEnum;
}
