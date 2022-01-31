import { validator, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator';

export default abstract class Validator {
  /**
   * Object for schemas.
   * Each key in object will correspong to a type of validation.
   * Each values will be a valid Adonis schema, made using schema.create
   */
  protected abstract schemas(type: string): ParsedTypedSchema<any>;

  /**
   * Object of error message objects used to pass custom error messages.
   * Each key will correspond to a valid validation type defined in schemas
   */
  protected errorMessages = {};

  /**
   * Cache key, to be used if validator schema caching is needed.
   * Refer https://preview.adonisjs.com/guides/validator/schema-caching
   */
  protected cacheKey: string;

  public async fire(data: { [key: string]: any }, type: string): Promise<any> {
    return validator.validate({
      schema: this.schemas(type),
      data,
      ...(this.errorMessages[type] ? { messages: this.errorMessages[type] } : {}),
      ...(this.cacheKey ? { cacheKey: this.cacheKey } : {}),
    });
  }
}
