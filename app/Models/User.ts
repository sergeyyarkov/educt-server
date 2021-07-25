/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import { DateTime } from 'luxon';
import { Exception } from '@adonisjs/core/build/standalone';
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';
import { nanoid } from 'nanoid';
import Role from 'App/Models/Role';
import Contact from 'App/Models/Contact';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

  @column({ serializeAs: null })
  public login: string;

  @column({ serializeAs: null })
  public password: string;

  @hasOne(() => Contact, {
    foreignKey: 'user_id',
  })
  public contacts: HasOne<typeof Contact>;

  @manyToMany(() => Role, {
    pivotTable: 'users_roles',
  })
  public roles: ManyToMany<typeof Role>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  /**
   * Checks if the input role is already attached, and if so, throws an error,
   * otherwise it attaches the role to the user.
   *
   * @param user User
   * @param inputRoles Array of roles to attach
   */
  public static async attachRoles(user: User, inputRoles: Role[]): Promise<void> {
    const currentRolesSlugs: string[] = user.roles.map(r => r.slug);
    const inputRolesSlugs: string[] = inputRoles.map(r => r.slug);

    currentRolesSlugs.forEach(s => {
      if (inputRolesSlugs.includes(s)) {
        throw new Exception(`Role "${s}" already attached to that user.`, 400, 'E_ROLE_ATTACHED');
      }
    });

    await user.related('roles').attach(inputRoles.map(r => r.id));
    await user.load('roles'); // load updated roles
  }

  /**
   * Before detach, checks if input role is attached to that user and
   * if not, throws an error.
   *
   * @param user User
   * @param inputRoles Array of roles to detach
   */
  public static async detachRoles(user: User, inputRoles: Role[]): Promise<void> {
    inputRoles.forEach(role => {
      if (!user.roles.map(r => r.id).includes(role.id)) {
        throw new Exception(`Role "${role.slug}" not attached to that user.`, 400, 'E_ROLE_NOT_ATTACHED');
      }
    });

    user.related('roles').detach(inputRoles.map(r => r.id));
    await user.load('roles');
  }

  /**
   * Assign id to user by nanoid.
   * @param user User
   */
  @beforeCreate()
  public static assignUui(user: User) {
    user.id = nanoid();
  }

  /**
   * Hash password before save
   * @param user User
   */
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
