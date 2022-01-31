import LessonProgress from 'App/Models/LessonProgress';

export default class LessonProgressRepository {
  private LessonProgress: typeof LessonProgress;

  constructor() {
    this.LessonProgress = LessonProgress;
  }

  public async get(user_id: string, lesson_id: string): Promise<LessonProgress | null> {
    const progress = await this.LessonProgress.query()
      .where('user_id', user_id)
      .andWhere('lesson_id', lesson_id)
      .first();

    return progress;
  }

  public async create(data: { user_id: string; lesson_id: string; is_watched: boolean }): Promise<LessonProgress> {
    const progress = await this.LessonProgress.create(data);
    return progress;
  }
}
