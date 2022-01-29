import crypto from 'crypto';

export default class OpaqueTokenHelper {
  /**
   * Parse token
   *
   * @param token token
   * @returns Hashed token with id
   */
  public static parseToken(token: string) {
    const parts = token.split('.');

    if (parts.length !== 2) {
      throw new Error('E_INVALID_API_TOKEN');
    }

    const id = Buffer.from(parts[0], 'base64').toString('utf-8');

    if (!id) {
      throw new Error('E_INVALID_API_TOKEN');
    }

    const hashed = crypto.createHash('sha256').update(parts[1]).digest('hex');

    return {
      hashed,
      id,
    };
  }
}
