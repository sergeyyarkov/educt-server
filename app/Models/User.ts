/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import { DateTime } from 'luxon';
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
import Course from 'App/Models/Course';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

  @column({ serializeAs: null })
  public login: string;

  @column()
  public email: string;

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

  @manyToMany(() => Course, {
    pivotTable: 'users_courses',
  })
  public courses: ManyToMany<typeof Course>;

  @manyToMany(() => Course, {
    pivotTable: 'courses_likes',
  })
  public likes: ManyToMany<typeof Course>;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

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
