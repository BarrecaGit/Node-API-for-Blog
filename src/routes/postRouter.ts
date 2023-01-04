import express from 'express';
import { Post } from "../model/postModel";
import { JWTKey } from '../routes/userRouter';
import jwt, { decode } from 'jsonwebtoken';
import { User } from '../model/userModel';

let postRouter = express.Router();

let postArray: Post[] = [];
pushTestPosts();


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

  // if the current users userId doesn't match the userId passed in, can't continue
  let token = req.headers['authorization']!.split(' ')[1];
  let currentUser = User.GetCurrentUser(token); // returns User

  // find the post by postId and compare the userId
  const foundPost = postArray.some(p => p.postId === parseInt(req.params.postId));

  if(foundPost) 
  {
      const updatedPost = req.body;
      postArray.forEach(post => {
          if(post.postId == parseInt(req.params.postId))
          {
            if(currentUser.userId === post.userId)
            {
              post.content = updatedPost.content ? updatedPost.content : post.content;
              post.headerImage = updatedPost.headerImage ? updatedPost.headerImage : post.headerImage;
              post.lastUpdated = new Date();
              return res.status(200).json({postArray});
            }
            else
            {
              return res.status(401).send({message:'Un-Authorized'})
            }
            
          }
      })
  } 
  else 
  {
      return res.status(404).send({ message: 'Post not Found' });
  }
      
  
});



// Delete post by postId
// needs auth
postRouter.delete('/:postId', (req, res, next) => {
  
  let token = req.headers['authorization']!.split(' ')[1];
  let currentUser = User.GetCurrentUser(token); 

  const found = postArray.some(p => p.postId === parseInt(req.params.postId));
  const foundPost = postArray.find(j => j.postId === parseInt(req.params.postId));
  if(found)
  {
    if(currentUser.userId === foundPost?.userId){
      postArray = postArray.filter(j => j.postId !== parseInt(req.params.postId));
      return res.status(204).json({postArray});
    }
    else
    {
      return res.status(401).send({message:'Un-Authorized'});
    }
  }
  else 
  {
    return res.status(404).json({ message: `Not Found: ${req.params.postId}` });
  }
  
});


function pushTestPosts(){
  // push dummy posts
  const seedArray:Post[] = [
    {
      postId: 0,
      createdDate: new Date(),
      title: "UFC'S 2022 BY THE NUMBERS",
      content: "As the year comes to an end and we look forward to the exciting action awaiting us in 2023, let’s celebrate this incredible year by looking at a breakdown of 2022 through numbers:",
      userId: "mbar9478",
      headerImage: "https://dmxg5wxfqgb4u.cloudfront.net/styles/inline/s3/2022-12/GettyImages-1420572610.jpg?itok=02JwvYwA",
      lastUpdated: new Date()
    },
    {
      postId: 1,
      createdDate: new Date(),
      title: `GILBERT BURNS: "I'M COMING TO BRAZIL FOR A FINISH"`,
      content: `Los Angeles — BELLATOR MMA has today announced the signing of women’s MMA pioneer and National Wrestling Hall of Fame inductee Sara McMann (13-6) to an exclusive, multi-fight contract.

      McMann, 42, is a decorated grappler and wrestler who has achieved remarkable success in those disciplines and in mixed martial arts. McMann was the first woman to earn a silver medal at the Olympic Games, taking the historic honor home after the 2004 Olympics in Athens, Greece. She is a three-time FILA Wrestling World Championships medalist and earned a silver medal at the 2011 Abu Dhabi Combat Club Submission Wrestling World Championship.
      
      "I am thrilled to have joined BELLATOR. BELLATOR has the deepest roster at women’s featherweight, and I look forward to tough scraps with these ladies. I want to thank the BELLATOR team, especially Mike Kogan and Scott Coker, for putting together such an outstanding offer, and I’d like to thank many BELLATOR fighters, including Cris Cyborg, for their collective support and encouragement.  Everything about this feels right, and I am grateful and looking forward to 2023!"
      
      McMann has previously challenged for the UFC bantamweight championship, and she holds notable victories over the likes of Tonya Evinger, Shayna Baszler, Lauren Murphy, and Jessica Eye. The American was victorious in her last outing, a unanimous decision over No. 9-ranked UFC women’s bantamweight Karol Rosa in March. McMann has won five of her 13 professional victories by submission, along with one knockout win.
      
      McMann will compete at featherweight upon joining the BELLATOR roster, a division helmed by reigning champion Cris Cyborg and featuring such contenders as Cat Zingano, Leah McCourt, Arlene Blencowe, and Sinead Kavanagh.`,
      userId: "mbar9478",
      headerImage: "https://assets.bellator.com/article_bellator_s_rb0n/original-1672187921.jpg",
      lastUpdated: new Date()
    },
    {
      postId: 2,
      createdDate: new Date(),
      title: `BELLATOR SIGNS WMMA PIONEER, OLYMPIC WRESTLING MEDALIST SARA MCMANN TO EXCLUSIVE MULTI-FIGHT CONTRACT`,
      content: "UFC Welterweight Gilbert Burns Is Determined To Put On The Performance Of A Lifetime In Front Of The Brazilian Faithful At UFC 283: Texeira vs Hill",
      userId: "mbar9478",
      headerImage: "https://dmxg5wxfqgb4u.cloudfront.net/styles/background_image_lg/s3/2022-12/123022-Gilbert-Burns-Flag-2-GettyImages-1327899403.jpg?h=d1cb525d&itok=9U0Wsph2",
      lastUpdated: new Date()
    }
  ]

  seedArray.forEach(post => {
    postArray.push(post);
  });
}

export { postRouter };