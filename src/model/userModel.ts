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

    // currentUser:User | undefined(userId:string,firstName:string,lastName:string,emailAddress:string){
    //     this.userId = userId;
    //     this.firstName = firstName;
    //     this.lastName = lastName;
    //     this.emailAddress = emailAddress;
    // }
}