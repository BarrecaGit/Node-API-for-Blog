"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("../routes/userRouter");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
let postRouter = express_1.default.Router();
exports.postRouter = postRouter;
let postArray = [];
postRouter.get('/', (req, res, next) => {
    // oldest to newest
    let sortedArray = postArray.sort((a, b) => Number(a.createdDate) - Number(b.createdDate));
    res.json(sortedArray);
});
//Get post by postId
postRouter.get('/:postId', (req, res, next) => {
    let postId = parseInt(req.params.postId);
    let foundPost = postArray.find(post => post.postId == postId);
    if (foundPost) {
        res.status(200).send(foundPost);
    }
    else {
        res.status(404).send({ message: 'Post not Found' });
    }
});
//Get post by userId
postRouter.get('/:userId', (req, res, next) => {
    console.log(req.header);
    let userId = req.params.userId;
    // let foundPost = postArray.find(post => post.userId == userId);
    let foundPostArray = [];
    for (let i = 0; i < postArray.length; i++) {
        let foundPost = postArray.find(post => post.userId == userId);
        if (foundPost) {
            foundPostArray.push(foundPost);
        }
    }
    if (foundPostArray) {
        res.status(200).send(foundPostArray);
    }
    else {
        res.status(404).send({ message: `No posts found by user ${userId}` });
    }
});
// Post a post
// needs auth
postRouter.post('/', (req, res, next) => {
    if (!req.body.title || !req.body.content) {
        return res.send({ msg: 'Please add a title and content' });
    }
    let token = req.headers['authorization'].split(' ')[1];
    let decoded = jsonwebtoken_1.default.verify(token, userRouter_1.JWTKey);
    console.log(decoded.data.userId);
    var newPost = {
        postId: getPostId(),
        createdDate: new Date(),
        title: req.body.title,
        content: req.body.content,
        userId: decoded.data.userId,
        headerImage: req.body.headerImage,
        lastUpdated: new Date()
    };
    postArray.push(newPost);
    return res.status(201).json(newPost);
});
function getPostId() {
    // get size of array
    let arraySize = postArray.length;
    let newId = arraySize + 1;
    return newId;
}
// patch post by Id
// needs auth
postRouter.patch('/:postId', (req, res, next) => {
    // if the current users userId doesn't match the userId passed in, can't continue
    let token = req.headers['authorization'].split(' ')[1];
    let currentUser = userModel_1.User.GetCurrentUser(token); // returns User
    // find the post by postId and compare the userId
    const foundPost = postArray.some(p => p.postId === parseInt(req.params.postId));
    if (foundPost) {
        const updatedPost = req.body;
        postArray.forEach(post => {
            if (post.postId == parseInt(req.params.postId)) {
                if (currentUser.userId === post.userId) {
                    post.content = updatedPost.content ? updatedPost.content : post.content;
                    post.headerImage = updatedPost.headerImage ? updatedPost.headerImage : post.headerImage;
                    post.lastUpdated = new Date();
                    return res.status(200).json({ postArray });
                }
                else {
                    return res.status(401).send({ message: 'Un-Authorized' });
                }
            }
        });
    }
    else {
        return res.status(404).send({ message: 'Post not Found' });
    }
});
// Delete post by postId
// needs auth
postRouter.delete('/:postId', (req, res, next) => {
    let token = req.headers['authorization'].split(' ')[1];
    let currentUser = userModel_1.User.GetCurrentUser(token);
    const found = postArray.some(p => p.postId === parseInt(req.params.postId));
    const foundPost = postArray.find(j => j.postId === parseInt(req.params.postId));
    if (found) {
        if (currentUser.userId === foundPost?.userId) {
            postArray = postArray.filter(j => j.postId !== parseInt(req.params.postId));
            return res.status(204).json({ postArray });
        }
        else {
            return res.status(401).send({ message: 'Un-Authorized' });
        }
    }
    else {
        return res.status(404).json({ message: `Not Found: ${req.params.postId}` });
    }
});
