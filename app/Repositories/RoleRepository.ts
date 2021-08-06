import Role from 'App/Models/Role';

export default class RoleRepository {
  private Role: typeof Role;

  constructor() {
    this.Role = Role;
  }

  public async getAll(params?: any) {
    const { roles }: any = params || {};
    const query = this.Role.query();

    if (roles) {
      query.whereIn('slug', roles);
    }

    const data = await query;
    return data;
  }

  public async getBySlug(slug: string) {
    const role = await this.Role.query().where('slug', slug);
    return role;
  }
}
