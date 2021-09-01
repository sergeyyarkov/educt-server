/**
 * Models
 */
import Contact from 'App/Models/Contact';
import User from 'App/Models/User';

/**
 * Validators
 */
import CreateContactsValidator from 'App/Validators/Contacts/CreateContactsValidator';
import UpdateContactsValidator from 'App/Validators/Contacts/UpdateContactsValidator';

export default class ContactRepository {
  private Contact: typeof Contact;

  constructor() {
    this.Contact = Contact;
  }

  /**
   * Get contacts by user id
   *
   * @param userId User id
   * @returns User contacts or null
   */
  public async getByUser(userId: string | number): Promise<Contact | null> {
    const contacts = await this.Contact.query().where('user_id', userId).first();
    return contacts;
  }

  /**
   * Create user contacts in database
   *
   * @param user User for associate the contacts
   * @param data Data contacts
   * @returns Created contacts
   */
  public async create(user: User, data: CreateContactsValidator['schema']['props']): Promise<Contact> {
    const contacts = await this.Contact.create(data);

    /**
     * Associate user
     */
    await contacts.related('user').associate(user);

    /**
     * Load updated contacts to user
     */
    await user.load('contacts');
    await user.load('roles');

    return contacts;
  }

  /**
   * Update user contacts
   *
   * @param user User
   * @param data Data to update
   * @returns Updated contacts or null
   */
  public async update(user: User, data: UpdateContactsValidator['schema']['props']): Promise<Contact | null> {
    const contacts = await this.Contact.query().where('user_id', user.id).first();

    if (contacts) {
      contacts.phone_number = data.phone_number ?? null;
      contacts.telegram_id = data.telegram_id?.substring(1) ?? null;
      contacts.twitter_id = data.twitter_id?.substring(1) ?? null;
      contacts.vk_id = data.vk_id ?? null;

      await contacts.save();
      await user.load('contacts');

      return contacts;
    }

    return null;
  }
}
