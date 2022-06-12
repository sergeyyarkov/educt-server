"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CookieHelper {
    static parseCookieString(string) {
        const values = string
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, value) => {
            const [key, ...rest] = value;
            acc[decodeURIComponent(key.trim())] = decodeURIComponent(rest.join('=').trim());
            return acc;
        }, {});
        return values;
    }
}
exports.default = CookieHelper;
//# sourceMappingURL=CookieHelper.js.map