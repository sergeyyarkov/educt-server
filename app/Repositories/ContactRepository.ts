import Contact from 'App/Models/Contact';
import User from 'App/Models/User';
import CreateUserValidator from 'App/Validators/User/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator';

export default class ContactRepository {
  private Contact: typeof Contact;

  constructor() {
    this.Contact = Contact;
  }

  /**
   * Creates user contacts in database
   *
   * @param user User for associate the contacts
   * @param data Data contacts
   * @returns Created contacts
   */
  public async create(user: User, data: Pick<CreateUserValidator['schema']['props'], 'email'>) {
    const contacts = await this.Contact.create(data);

    await contacts.related('user').associate(user);
    await user.load('contacts');
    await user.load('roles');

    return contacts;
  }

  public async update(user: User, data: Pick<UpdateUserValidator['schema']['props'], 'email'>) {
    const contacts = await this.Contact.query().where('user_id', user.id).first();

    /**
     * Update user contacts
     */
    if (contacts) {
      contacts.email = data.email;

      await contacts.save();
      await user.load('contacts');

      return contacts;
    }

    /**
     * Create new user contacts if contacts doesn't exist
     */
    await user.related('contacts').create({
      email: data.email,
    });

    await user.load('contacts');

    return user.contacts;
  }
}
