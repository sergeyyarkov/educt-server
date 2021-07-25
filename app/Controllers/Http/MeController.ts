import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';
import Logger from '@ioc:Adonis/Core/Logger';
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator';
import Contact from 'App/Models/Contact';
import UpdateContactsValidator from 'App/Validators/UpdateContactsValidator';

export default class MeController {
  private readonly guard: 'api';

  private readonly contact: typeof Contact;

  constructor() {
    this.contact = Contact;
  }

  /**
   * Shows user info of the access token resource owner.
   * GET /me
   */
  public async index({ response, auth }: HttpContextContract) {
    const user = await auth.use(this.guard).authenticate();

    await user.load('contacts');
    await user.load('roles');

    return response.ok({
      message: 'Fetched data about me.',
      data: user,
    });
  }

  /**
   * Change password of authenticated user
   * PATCH /me/password
   */
  public async changePassword({ request, response, auth }: HttpContextContract) {
    await request.validate(ChangePasswordValidator);

    const user = await auth.use(this.guard).authenticate();
    const oldPassword: string = request.input('oldPassword');
    const newPassword: string = request.input('newPassword');

    if (oldPassword === newPassword) {
      throw new Exception('The new password is the same as the old one.', 400, 'E_PASSWORD_VALUES');
    }

    /**
     * Verify old password
     */
    if (!(await Hash.verify(user.password, oldPassword))) {
      throw new Exception('Invalid credentials.', 403, 'E_INVALID_CREDENTIALS');
    }

    /**
     * Update user password
     */
    user.password = newPassword;
    await user.save();

    Logger.info(`Password of user with id: "${user.id}" was updated.`);

    return response.ok({
      message: 'The password was successfully changed to the new value.',
    });
  }

  /**
   * Update contacts of authenticated user
   * PATCH /me/contacts
   */
  public async updateContacts({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(UpdateContactsValidator);
    const user = await auth.use(this.guard).authenticate();
    const contacts = await this.contact.findByOrFail('user_id', user.id);

    /**
     * Update contacts
     */
    if (payload.email) contacts.email = payload.email;
    contacts.phone_number = payload.phone_number ?? null;
    contacts.vk_id = payload.vk_id ?? null;
    contacts.twitter_id = payload.twitter_id ?? null;
    contacts.telegram_id = payload.telegram_id ?? null;

    await contacts.save();

    return response.ok({
      message: `Contacts has been successfully updated.`,
      data: contacts,
    });
  }
}
