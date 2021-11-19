import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import ColorEnum from 'App/Datatypes/Enums/ColorEnum';
import Color from 'App/Models/Color';

export default class RoleSeeder extends BaseSeeder {
  private Color: typeof Color;

  public async run() {
    this.Color = Color;

    await this.Color.createMany(
      (Object.keys(ColorEnum) as Array<keyof typeof ColorEnum>).map(k => ({
        name: k,
        hex: ColorEnum[k],
      }))
    );
  }
}
