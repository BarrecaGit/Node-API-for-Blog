import { JWTKey } from '../routes/userRouter';
import jwt, { decode } from 'jsonwebtoken';

export class User
{
    userId:string = '';
    firstName:string = '';
    lastName:string = '';
    emailAddress:string = '';
    password?:string = '';


    constructor(userId:string,firstName:string,lastName:string,emailAddress:string,password:string) {

        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;

    }

    static IsValidUser(obj:any)
    {
        return obj.userId && obj.emailAddress && obj.password && obj.firstName && obj.lastName;
    }


    static GetCurrentUser(token:string) {
        
        let CurrentUser = new User('','','','','');
        let decoded = jwt.verify(token, JWTKey) as any;
        CurrentUser.userId = decoded.data.userId;
        CurrentUser.firstName = decoded.data.firstName;
        CurrentUser.lastName = decoded.data.lastName;
        CurrentUser.emailAddress = decoded.data.emailAddress;
        CurrentUser.password = decoded.data.password;
        //console.log(CurrentUser, CurrentUser.lastName);
        return CurrentUser;
    }
}