import express from 'express';
import { stringify } from 'querystring';
import { User } from "../model/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


let userRouter = express.Router();
const JWTKey="6604E2F824AB70A8A67794E0F19ED171A6463046C36F0D69837121E5AEAE100E";
let userArray: User[] = [];

// Gets All Users 
// needs auth
userRouter.get('/', (req, res, next) => {
    //copyarray without passwords
    let copyarray = userArray;
    copyarray.forEach(element => {
      delete element.password;// may need to change
    });

    res.json(copyarray);
});

// Gets login and returns token
userRouter.get('/Login/:us/:pwd', (req, res, next) => {
        
    let person = userArray.find(u => u.userId === req.params.us);
    
    if(person){
        bcrypt.compare(req.params.pwd,person?.password!, (err,result)=>{
       
        if(result) 
        {
          let token = jwt.sign({
              exp: Math.floor((Date.now() / 1000) + (60 * 60)),
              data: 
              {
                  userId: person?.userId,
                  firstName:person?.firstName, 
                  lastName:person?.lastName,
                  emailAddress:person?.emailAddress
              }
            }, JWTKey);
            
          res.send({ token: token });
        }
        else
        {
            res.status(401).send({message:'Un-Authorized'})
        }
      });
    }
    else
    {
        res.status(401).send({message:'Un-Authorized'})
    }

});


// Get member by userId
// needs auth
userRouter.get('/:userId', (req, res, next) => {
    let userId = req.params.userId;

    let foundUser = userArray.find(user => user.userId == userId.toString());

    if (foundUser) {
      var copyOffoundUser:User = {
        userId: foundUser.userId,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        emailAddress: foundUser.emailAddress
      };
        res.send(copyOffoundUser);
    }
    else {
        res.status(404).send({ message: 'User not Found' });
    }
});

// Delete member by userId
// needs auth
userRouter.delete('/:userId', (req, res, next) => {
    const foundUser = userArray.some(user => user.userId === req.params.userId);
    if(foundUser) {
      userArray = userArray.filter(user => user.userId !== req.params.userId);
      res.status(204).json({
        msg: `user deleted ${req.params.userId}`
      });
    } else {
        res.status(404).json({ message: `User not found. userId not removed: ${req.params.userId}` });
    }
});


// Create User
userRouter.post('/', (req, res, next) => {

    // if the req.body doesnt pass return 406
    if(!req.body.userId || !req.body.firstName || !req.body.lastName || !req.body.emailAddress || !req.body.password){
      return res.status(406).json({ msg: 'All properties are required in the user object (userId, firstName, lastName, emailAddress, password)'});
    }
    
    // continue onto creating a new user that models the req.body
    var newUser:User = {
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      password: req.body.password
    }

    // check for empty input
    let isEmpty = checkEmpties(newUser);
      
    
    // if not empty, trim input
    if(!isEmpty){
      newUser = trimFields(newUser) 
    }else{
      return res.status(406).json({ msg: 'All properties are required in the user object (userId, firstName, lastName, emailAddress, password)'});
    }
    
    // checking for taken userId
    var userIdTaken:boolean = false;

    userArray.forEach(j => {
        
        if(j.userId == newUser.userId) {
          
          userIdTaken = true;
          return res.status(409).json({ msg: 'Conflict userId already in use'});
              
        }   
        
    });

    // check for valid email
    var validEmail:boolean = checkEmail(newUser.emailAddress);
    if(!validEmail){
      return res.status(406).json({msg: 'invalid email'});
    }
    
    // if passed both checks push newUser to userArray and respond with a copy and no password
    if(!userIdTaken){
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password!, salt, function(err, hash){
          newUser.password = hash;
          userArray.push(newUser);
          console.log("2nd attempt: ",userArray)
        })
      })
      // respond with copy of the newUser object without the password
      // var copyOfNewUser:User = {
      //   userId: newUser.userId,
      //   firstName: newUser.firstName,
      //   lastName: newUser.lastName,
      //   emailAddress: newUser.emailAddress
      // };
      var copyOfNewUser = noPwdUser(newUser);
      
      return res.status(201).json(copyOfNewUser);
    }
      
});

function checkEmail(emailAddress:string){
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  return regex.test(emailAddress);
}

function checkEmpties(user:User){
  let isEmpty = false;
  // checks for empties
  if(user.userId.trim().length === 0 || user.firstName.trim().length === 0 || user.lastName.trim().length === 0 || user.emailAddress.trim().length === 0 || user.password?.trim().length === 0){
    return isEmpty = true;
  }
}


function trimFields(user:User){
  
  // if not empty, return trimmed entries to be checked
  var trimmedUser = {
    userId: user.userId.trim(),
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
    emailAddress: user.emailAddress.trim(),
    password: user.password?.trim()
  }

  return trimmedUser;
  
}

function noPwdUser(user:User){
  var copyOfNewUser2:User={
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  }
  return copyOfNewUser2;
}

// patch member by Id
// needs auth
userRouter.patch('/:userId', (req, res, next) => {
  
    const foundUser = userArray.some(user => user.userId === req.params.userId);

    console.log("Found user ?", foundUser, req.params.userId);
  
    if(foundUser) {
  
        const updatedUser = req.body;
        
        // check for valid email
        var validEmail:boolean = checkEmail(updatedUser.emailAddress);
        if(!validEmail){
          return res.status(406).json({msg: 'invalid email'});
        }
  
        userArray.forEach(user => {
          
            if(user.userId == req.params.userId) {
                  
              user.firstName = updatedUser.firstName ? updatedUser.firstName : user.firstName;
              user.lastName = updatedUser.lastName ? updatedUser.lastName : user.lastName;
              user.emailAddress = updatedUser.emailAddress ? updatedUser.emailAddress : user.emailAddress;
              user.password = updatedUser.password ? updatedUser.password : user.password;
  
              // Instructor Feedback: The msg: here was not necessary and did not adhere to the specification and was not necessary.
              var copyOfUpdatedUser = noPwdUser(user);
              return res.status(200).json({ message: 'User updated successfully', copyOfUpdatedUser});
  
            }
        });
    } else {
        return res.status(404).send({ message: 'User not Found' });
    }
  
  
});



export { userRouter,JWTKey };