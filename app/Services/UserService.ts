import { inject, Ioc } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

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
 * Services
 */
import CourseService from './CourseService';

/**
 * Validators
 */
import CreateUserValidator from 'App/Validators/User/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator';

/**
 * Datatypes
 */
import RoleEnum from 'App/Datatypes/Enums/RoleEnum';

/**
 * Helpers
 */
import RoleHelper from 'App/Helpers/RoleHelper';
import CourseRepository from 'App/Repositories/CourseRepository';

@inject()
export default class UserService {
  private userRepository: UserRepository;

  private roleRepository: RoleRepository;

  private courseRepository: CourseRepository;

  private courseService: CourseService;

  constructor(
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    courseRepository: CourseRepository,
    courseService: CourseService
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.courseRepository = courseRepository;
    this.courseService = courseService;
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
    const result: IResponse = {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'Fetched all users.',
      data: {},
    };

    if (users instanceof Array) {
      result.data = users;
      return result;
    }

    result.data = users.data;
    result.meta = {
      pagination: users.meta,
    };

    return result;
  }

  /**
   * Create new user
   *
   * @param data Input for create new user
   * @returns Response
   */
  public async createUser(data: CreateUserValidator['schema']['props'], ctx: HttpContextContract): Promise<IResponse> {
    const role = await this.roleRepository.getBySlug(data.role);

    /**
     * Cannot find role
     */
    if (!role) {
      return {
        success: false,
        status: HttpStatusEnum.NOT_FOUND,
        message: 'Role not found.',
        data: {},
        error: {
          code: 'E_NOT_FOUND',
        },
      };
    }

    await ctx.bouncer.with('RolePolicy').authorize('manage', [role.slug as RoleEnum]);

    /**
     * Create new user
     */
    const user = await this.userRepository.create(data);

    /**
     * Attach role
     */
    await user.related('roles').attach([role.id]);
    await user.load('roles');

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
  public async updateUser(
    id: string | number,
    data: UpdateUserValidator['schema']['props'],
    ctx: HttpContextContract
  ): Promise<IResponse> {
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

    await ctx.bouncer.with('RolePolicy').authorize('manage', user.roles.map(r => r.slug) as [RoleEnum]);
    const updated = await this.userRepository.update(id, data);

    /**
     * Update user role
     */
    if (data.role) {
      const role = await this.roleRepository.getBySlug(data.role);

      if (role) {
        await ctx.bouncer.with('RolePolicy').authorize('manage', [data.role]);
        await this.userRepository.updateRoles(user, [role]);
      }
    }

    return {
      success: true,
      status: HttpStatusEnum.OK,
      message: 'User updated.',
      data: updated || {},
    };
  }

  /**
   * Delete user
   *
   * @param id User id
   * @returns Response
   */
  public async deleteUser(id: string | number, ctx: HttpContextContract): Promise<IResponse> {
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

    await ctx.bouncer.with('RolePolicy').authorize('manage', user.roles.map(r => r.slug) as [RoleEnum]);

    if (RoleHelper.userContainRoles(user.roles, [RoleEnum.TEACHER, RoleEnum.ADMIN])) {
      const courses = await this.courseRepository.getByTeacherId(id);
      await this.courseService.deleteAllFiles(courses);
    }

    await this.userRepository.delete(id);

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
