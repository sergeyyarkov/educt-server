import Color from 'App/Models/Color';
import * as utils from 'App/Utils';

export default class ColorHelper {
  public static async generateRandomColor(): Promise<Color | null> {
    const colors = await Color.query();
    if (colors.length === 0) return null;
    return colors[utils.generateRandomInt({ min: 0, max: colors.length - 1 })];
  }
}
