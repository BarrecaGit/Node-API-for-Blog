"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
class Comment {
    constructor(commentId, comment, userId, postId, commentDate) {
        this.commentId = 0;
        this.comment = '';
        this.userId = '';
        this.postId = 0;
        this.commentDate = new Date();
        this.commentId = commentId;
        this.comment = comment;
        this.userId = userId;
        this.postId = postId;
        this.commentDate = commentDate;
    }
}
exports.Comment = Comment;
