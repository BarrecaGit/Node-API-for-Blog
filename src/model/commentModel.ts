export class Comment
{
    commentId:number = 0;
    comment:string = '';
    userId:string = '';
    postId:number = 0;
    commentDate:Date = new Date();
    
    constructor(commentId:number,comment:string,userId:string,postId:number,commentDate:Date) 
    {
        this.commentId = commentId;
        this.comment = comment;
        this.userId = userId;
        this.postId = postId;
        this.commentDate = commentDate;
    }
}