import express from 'express';
import { Post } from "../model/postModel";
import { JWTKey } from '../routes/userRouter';
import jwt, { decode } from 'jsonwebtoken';

let postRouter = express.Router();

let postArray: Post[] = [];

postRouter.get('/', (req, res, next) => {
  // oldest to newest
  let sortedArray = postArray.sort((a,b)=>Number(a.createdDate) - Number(b.createdDate));
  res.json(sortedArray);
});

//Get post by postId
postRouter.get('/:postId', (req, res, next) => {
  let postId = parseInt(req.params.postId);
  let foundPost = postArray.find(post => post.postId == postId);
  if(foundPost){
    res.status(200).send(foundPost);
  }else{
    res.status(404).send({ message: 'Post not Found' });
  }
});

//Get post by userId
postRouter.get('/:userId', (req, res, next) => {
  console.log(req.header)
  let userId = req.params.userId;
  
  // let foundPost = postArray.find(post => post.userId == userId);
  let foundPostArray:Post[] = []; 
  for(let i = 0; i < postArray.length; i++){
    let foundPost:Post | undefined = postArray.find(post => post.userId == userId);
    if(foundPost)
    {
      foundPostArray.push(foundPost)
    }
    
  }
  

  if(foundPostArray){
    res.status(200).send(foundPostArray);
  }else{
    res.status(404).send({ message: `No posts found by user ${userId}` });
  }
});

// Post a post
// needs auth
postRouter.post('/', (req, res, next) => {
    console.log(req.body)
    // needs a title and content
    if(!req.body.title || !req.body.content ){
      return res.send({ msg: 'Please add a title and content'});
    }
    
    let token = req.headers['authorization']!.split(' ')[1];
    
    let decoded = jwt.verify(token, JWTKey) as any;
    console.log(decoded.data.userId)
    

    var newPost:Post={
      postId: getPostId(),
      createdDate: new Date(),
      title:req.body.title,
      content:req.body.content,
      userId:decoded.data.userId,
      headerImage:req.body.headerImage,
      lastUpdated: new Date()
    }
    postArray.push(newPost);
    return res.status(201).json(newPost);
});

function getPostId(){
  // get size of array
  let arraySize = postArray.length;
  let newId = arraySize + 1;
  return newId; 
}


// patch post by Id
// needs auth
postRouter.patch('/:postId', (req, res, next) => {
  
  const foundPost = postArray.some(p => p.postId === parseInt(req.params.postId));

  if(foundPost) {
      const updatedPost = req.body;
      postArray.forEach(post => {
          if(post.postId == parseInt(req.params.postId)) {
            post.content = updatedPost.content ? updatedPost.content : post.content;
            post.headerImage = updatedPost.headerImage ? updatedPost.headerImage : post.headerImage;
            post.lastUpdated = new Date();
            return res.status(200).json({postArray});
          }
      });
  } else {
      return res.status(404).send({ message: 'Post not Found' });
  }
      
  
});



// Delete post by postId
// needs auth
postRouter.delete('/:postId', (req, res, next) => {
  const foundPost = postArray.some(p => p.postId === parseInt(req.params.postId));
  if(foundPost) {
    postArray = postArray.filter(j => j.postId !== parseInt(req.params.postId));
    return res.status(204);
  } else {
    return res.status(404).json({ message: `Not Found: ${req.params.postId}` });
  }
});


export { postRouter };