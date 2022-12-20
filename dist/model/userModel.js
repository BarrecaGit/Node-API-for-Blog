"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
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
}
exports.User = User;
