import express from 'express';
import jwt from 'jsonwebtoken';
import { JWTKey } from '../routes/userRouter';

let authRouter = express.Router();

authRouter.use('/', (req, res, next) => {
    
    console.log(req.url);
    console.log(req.method);

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
            method:'GET',
            url:'/Comments'
        }
    ];

    let cont=true;
    for (let per of methodArray) 
    {
        if(req.url.includes('/Login/')){
            continue;
        }
        else
        {
            if (req.url.includes(per.url) && req.method == per.method) 
            {
                
                if (req.headers['authorization']) 
                {
                
                    try 
                    {
                        let verifiedToken = jwt.verify(req.headers['authorization'].replace('Bearer ', ''), JWTKey);
                        if (verifiedToken) 
                        {
                            continue;
                        }
                        else 
                        {
                            cont=false;
                            break;
                        }
                    }
                    catch
                    {
                        cont=false;
                        break;
                    }
                }
                else
                {
                    
                    cont=false;
                    break;
                }
                
            }
        }
        
    }
    if(cont)
       next();
    else
    {
        res.status(401).send({message:'You are UnAuthorized'});
    }
    
});
export { authRouter };