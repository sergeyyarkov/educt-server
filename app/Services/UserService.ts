import { inject, Ioc } from '@adonisjs/core/build/standalone';

/**
 * Interfaces
 */
import IResponse from 'App/Datatypes/Interfaces/IResponse';

/**
 * Enums
 */
import HttpStatusEnum from 'App/Datatypes/Enums/HttpStatusEnum';

/**
 * Models
 */
import Role from 'App/Models/Role';

/**
 * Repositories
 */
import RoleRepository from 'App/Repositories/RoleRepository';
import UserRepository from 'App/Repositories/UserRepository';

/**
 * Validators
 */
import CreateUserValidator from 'App/Validators/User/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator';

@inject()
export default class UserService {
  private userRepository: UserRepository;

  private roleRepository: RoleRepository;

  constructor(userRepository: UserRepository, roleRepository: RoleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  /**
   * Fetch one user by id
   *
   * @param id Id of user
   * @returns Response data
   */
  public async fetchUser(id: string | number): Promise<IResponse> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'User not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched user.',
      data: user,
    };
  }

  /**
   * Fetch list of users
   *
   * @param params Params for finding user
   * @returns Response data
   */
  public async fetchUsers(params?: any): Promise<IResponse> {
    const users = await this.userRepository.getAll(params);

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched all users.',
      data: users.data,
      meta: {
        pagination: users.meta,
      },
    };
  }

  /**
   * Create new user
   *
   * @param data Input for create new user
   * @returns Response
   */
  public async createUser(data: CreateUserValidator['schema']['props']): Promise<IResponse> {
    const user = await this.userRepository.create(data);

    return {
      success: true,
      status: HttpStatusEnum.CREATED,
      message: 'User created.',
      data: user,
    };
  }

  /**
   * Update user
   *
   * @param id User id
   * @param data Data to update
   * @returns Response
   */
  public async updateUser(id: string | number, data: UpdateUserValidator['schema']['props']): Promise<IResponse> {
    const user = await this.userRepository.update(id, data);

    if (!user) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'User not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'User updated.',
      data: user,
    };
  }

  /**
   * Delete user
   *
   * @param id User id
   * @returns Response
   */
  public async deleteUser(id: string | number): Promise<IResponse> {
    const user = await this.userRepository.delete(id);

    if (!user) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'User not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'User deleted.',
      data: user,
    };
  }

  /**
   * Attach array of roles to user
   *
   * @param id User id
   * @param input Roles
   * @returns Response
   */
  public async attachRolesToUser(id: string | number, input: string[]): Promise<IResponse> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'User not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    const roles = await this.roleRepository.getAll({ roles: input });
    let attachedRole: Role | undefined;

    /**
     * Set attachedRole variable if some role already
     * attached to user.
     */
    roles.some(inputRole => {
      const existed = user.roles.find(role => role.slug === inputRole.slug);
      if (existed) {
        attachedRole = inputRole;
        return true;
      }
      return false;
    });

    if (attachedRole) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: `Role "${attachedRole.name}" already attached to that user.`,
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    await user.related('roles').attach([...roles.map(r => r.id)]);
    await user.load('roles');

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Roles attached.',
      data: user.roles,
    };
  }

  /**
   * Detach array of role from user
   *
   * @param id User id
   * @param input Roles
   * @returns Response
   */
  public async detachRolesFromUser(id: string | number, input: string[]): Promise<IResponse> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'User not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    const roles = await this.roleRepository.getAll({ roles: input });
    let notAttachedRole: Role | undefined;

    /**
     * Set notAttachedRole variable if some role
     * not attached to user.
     */
    roles.forEach(role => {
      if (!user.roles.map(r => r.id).includes(role.id)) {
        notAttachedRole = role;
      }
    });

    if (notAttachedRole) {
      return {
        success: false,
        status: HttpStatusEnum.BAD_REQUEST,
        message: `Role "${notAttachedRole.name}" not attached to that user.`,
        data: {},
        error: {
          code: 'E_BAD_REQUEST',
        },
      };
    }

    await user.related('roles').detach([...roles.map(r => r.id)]);
    await user.load('roles');

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Roles detached.',
      data: user.roles,
    };
  }
}

new Ioc().make(UserService);
