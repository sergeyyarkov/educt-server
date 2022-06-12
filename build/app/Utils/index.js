"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomInt = void 0;
const generateRandomInt = ({ min, max }) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.generateRandomInt = generateRandomInt;
//# sourceMappingURL=index.js.map