"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class OpaqueTokenHelper {
    static parseToken(token) {
        const parts = token.split('.');
        if (parts.length !== 2) {
            throw new Error('E_INVALID_API_TOKEN');
        }
        const id = Buffer.from(parts[0], 'base64').toString('utf-8');
        if (!id) {
            throw new Error('E_INVALID_API_TOKEN');
        }
        const hashed = crypto_1.default.createHash('sha256').update(parts[1]).digest('hex');
        return {
            hashed,
            id,
        };
    }
}
exports.default = OpaqueTokenHelper;
//# sourceMappingURL=OpaqueTokenHelper.js.map