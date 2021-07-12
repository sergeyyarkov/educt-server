import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import CreateUserValidator from 'App/Validators/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UsersController {
  private readonly userModel: typeof User;

  constructor() {
    this.userModel = User;
  }

  /**
   * Show a list of all users.
   * GET /users
   *
   * @returns {Promise<User[]>}
   */

  public async index(): Promise<User[]> {
    const users = this.userModel.all();
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
    const user = await this.userModel.findOrFail(params.user_id);
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
    const user = await this.userModel.create({
      name: request.input('name'),
      surname: request.input('surname'),
      patronymic: request.input('patronymic'),
      login: request.input('login'),
      email: request.input('email'),
      password: request.input('password'),
    });

    return user;
  }

  /**
   * Update a user in a system by "id".
   * PUT /users
   *
   * @param {HttpContextContract} context
   * @returns {Promise<User>}
   */

  public async update({ request, params }: HttpContextContract): Promise<User> {
    await request.validate(UpdateUserValidator);
    const user = await this.userModel.findOrFail(params.id);
    user.name = request.input('name');
    user.surname = request.input('surname');
    user.patronymic = request.input('patronymic');
    user.login = request.input('login');
    user.email = request.input('email');
    user.password = request.input('password');
    await user.save();

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
    const user = await this.userModel.findOrFail(params.id);
    await user.delete();

    return user;
  }
}
