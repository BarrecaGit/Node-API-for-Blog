"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const userRouter_1 = require("../routes/userRouter");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class User {
    constructor(userId, firstName, lastName, emailAddress, password) {
        this.userId = '';
        this.firstName = '';
        this.lastName = '';
        this.emailAddress = '';
        this.password = '';
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    }
    static IsValidUser(obj) {
        return obj.userId && obj.emailAddress && obj.password && obj.firstName && obj.lastName;
    }
    static GetCurrentUser(token) {
        let CurrentUser = new User('', '', '', '', '');
        let decoded = jsonwebtoken_1.default.verify(token, userRouter_1.JWTKey);
        CurrentUser.userId = decoded.data.userId;
        CurrentUser.firstName = decoded.data.firstName;
        CurrentUser.lastName = decoded.data.lastName;
        CurrentUser.emailAddress = decoded.data.emailAddress;
        CurrentUser.password = decoded.data.password;
        //console.log(CurrentUser, CurrentUser.lastName);
        return CurrentUser;
    }
}
exports.User = User;
