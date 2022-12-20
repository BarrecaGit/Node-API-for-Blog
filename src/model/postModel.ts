import { postRouter } from "../routes/postRouter";

export class Post
{
    postId:number = 0;
    createdDate:Date = new Date();
    title:string = ''; 
    content:string = ''; 
    userId:string = '';
    headerImage:string = ''; 
    lastUpdated:Date = new Date();

    
    constructor(postId:number,createdDate:Date,title:string,content:string,userId:string,headerImage:string,lastUpdated:Date) 
    {
        this.postId = postId;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }

}