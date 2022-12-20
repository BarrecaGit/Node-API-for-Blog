"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(postId, createdDate, title, content, userId, headerImage, lastUpdated) {
        this.postId = 0;
        this.createdDate = new Date();
        this.title = '';
        this.content = '';
        this.userId = '';
        this.headerImage = '';
        this.lastUpdated = new Date();
        this.postId = postId;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }
}
exports.Post = Post;
