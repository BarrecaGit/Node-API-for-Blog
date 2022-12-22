"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRouter_1 = require("../routes/userRouter");
let authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.use('/', (req, res, next) => {
    // console.log(req.url);
    // console.log(req.method);
    let methodArray = [
        {
            method: 'GET',
            url: '/Users'
        },
        {
            method: 'GET',
            url: '/Users/userId'
        },
        {
            method: 'DELETE',
            url: '/Users/userId'
        },
        {
            method: 'PATCH',
            url: '/Users/userId'
        },
        {
            method: 'POST',
            url: '/Posts'
        },
        {
            method: 'PATCH',
            url: '/Posts/postId'
        },
        {
            method: 'DELETE',
            url: '/Posts/postId'
        },
        {
            method: 'GET',
            url: '/Comments'
        }
    ];
    let cont = true;
    for (let per of methodArray) {
        if (req.url.includes('/Login/')) {
            continue;
        }
        else {
            if (req.url.includes(per.url) && req.method == per.method) {
                if (req.headers['authorization']) {
                    try {
                        let verifiedToken = jsonwebtoken_1.default.verify(req.headers['authorization'].replace('Bearer ', ''), userRouter_1.JWTKey);
                        if (verifiedToken) {
                            continue;
                        }
                        else {
                            cont = false;
                            break;
                        }
                    }
                    catch {
                        cont = false;
                        break;
                    }
                }
                else {
                    cont = false;
                    break;
                }
            }
        }
    }
    if (cont)
        next();
    else {
        res.status(401).send({ message: 'You are UnAuthorized' });
    }
});
