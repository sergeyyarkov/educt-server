"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusCodeEnum;
(function (StatusCodeEnum) {
    StatusCodeEnum[StatusCodeEnum["OK"] = 200] = "OK";
    StatusCodeEnum[StatusCodeEnum["CREATED"] = 201] = "CREATED";
    StatusCodeEnum[StatusCodeEnum["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCodeEnum[StatusCodeEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCodeEnum[StatusCodeEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCodeEnum[StatusCodeEnum["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCodeEnum[StatusCodeEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCodeEnum[StatusCodeEnum["CONFLICT"] = 409] = "CONFLICT";
    StatusCodeEnum[StatusCodeEnum["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
    StatusCodeEnum[StatusCodeEnum["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(StatusCodeEnum || (StatusCodeEnum = {}));
exports.default = StatusCodeEnum;
//# sourceMappingURL=HttpStatusEnum.js.map