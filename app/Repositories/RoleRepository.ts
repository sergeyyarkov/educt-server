import Role from 'App/Models/Role';

export default class RoleRepository {
  private Role: typeof Role;

  constructor() {
    this.Role = Role;
  }

  /**
   * Get list of roles
   *
   * @param params Params to find roles
   * @returns Array of roles
   */
  public async getAll(params?: any) {
    const { roles }: any = params || {};
    const query = this.Role.query();

    if (roles) {
      query.whereIn('slug', roles);
    }

    const data = await query;
    return data;
  }

  /**
   * Get role by slug
   *
   * @param slug Role slug
   * @returns Role or null
   */
  public async getBySlug(slug: string) {
    const role = await this.Role.query().where('slug', slug).first();
    return role;
  }
}
