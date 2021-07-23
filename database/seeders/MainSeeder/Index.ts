import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Application from '@ioc:Adonis/Core/Application';

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    const Seeder = seeder.default;

    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (Seeder.developmentOnly && !Application.inDev) {
      return;
    }

    await new Seeder(this.client).run();
  }

  public async run() {
    await this.runSeeder(await import('../Role'));
    await this.runSeeder(await import('../User'));
  }
}
