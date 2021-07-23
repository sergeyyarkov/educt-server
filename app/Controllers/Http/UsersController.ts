import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import Contact from 'App/Models/Contact';
import CreateUserValidator from 'App/Validators/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UsersController {
  private readonly user: typeof User;

  private readonly role: typeof Role;

  private readonly contact: typeof Contact;

  constructor() {
    this.user = User;
    this.role = Role;
    this.contact = Contact;
  }

  /**
   * Show a list of all users.
   * GET /users
   *
   * @returns {Promise<User[]>}
   */

  public async index(): Promise<User[]> {
    const users = await this.user.query().preload('contacts').preload('roles');
    return users;
  }

  /**
   * Show a current user by "id" parameter.
   * GET /users/:id
   *
   * @param {HttpContextContract} context
   * @returns {Promise<User>}
   */

  public async show({ params }: HttpContextContract): Promise<User> {
    const user = await this.user.findOrFail(params.id);

    await user.load('contacts');
    await user.load('roles');

    return user;
  }

  /**
   * Creates a new user in a system.
   * POST /users
   *
   * @param {HttpContextContract} context
   * @returns {Promise<User>} - Created user.
   */

  public async store({ request }: HttpContextContract): Promise<User> {
    await request.validate(CreateUserValidator);

    const roles = await this.role.query().whereIn('slug', request.input('roles'));
    const user = await this.user.create({
      first_name: request.input('first_name'),
      last_name: request.input('last_name'),
      login: request.input('login'),
      password: request.input('password'),
    });

    await user.related('contacts').create({ email: request.input('email') });
    await user.related('roles').attach(roles.map(r => r.id));

    await user.load('roles');
    await user.load('contacts');

    return user;
  }

  /**
   * Update a user in a system by "id".
   * PATCH /users/:id
   *
   * @param {HttpContextContract} context
   * @returns {Promise<User>}
   */

  public async update({ request, params }: HttpContextContract): Promise<User> {
    await request.validate(UpdateUserValidator);

    /**
     * User update
     */
    const user = await this.user.findOrFail(params.id);
    user.first_name = request.input('first_name');
    user.last_name = request.input('last_name');
    user.login = request.input('login');
    user.password = request.input('password');

    // await user.load('roles');

    /**
     * Contacts update
     */
    const contacts = await this.contact.findByOrFail('user_id', params.id);
    contacts.email = request.input('email');

    /**
     * Save the updated data
     */
    await user.save();
    await contacts.save();

    /**
     * Load the updated data to return
     */
    await user.load('roles');
    await user.load('contacts');

    return user;
  }

  /**
   * Delete a user by "id".
   * DELETE /users
   *
   * @param {HttpContextContract} context
   * @returns {Promise<User>}
   */

  public async destroy({ params }: HttpContextContract): Promise<User> {
    const user = await this.user.findOrFail(params.id);
    await user.delete();

    return user;
  }
}
