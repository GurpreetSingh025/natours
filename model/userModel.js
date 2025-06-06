const mongoose = require('mongoose') ;
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name : {
         type : String ,
         required : [true , "Name is required"]
    } ,
    email : {
       type : String ,
       required : [true , 'Email is required'] ,
       unique : true ,
       validate : {
          validator : function(val){
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(regex.test(val)){
               return true ;
            }
            return false ;            
          }
       }
    } ,
    photo : {
        type : String ,
        required : false
    } ,
    password : {
         type : String ,
         required : [true , 'Password is required'] ,
         minlength : 8 , 
         select : false 
    } , 
    passwordConfirm : {
        type : String ,
        required : [true , "Confirmed password is required"] ,
        select : false ,
        validate : {
             validator : function(val){
                 if(this.password === val){
                    return true ;
                 }
                 return false ;
             } ,
             message : "Confirm password must be same as password"
        } 
    } ,
    passwordChangedAt : {
        type : Date 
    }
})
userSchema.methods.isPasswordValid = async function(encryptedPassword , userEnteredPassword){
    return await bcrypt.compare(userEnteredPassword , encryptedPassword) ;
}
userSchema.methods.changePasswordAfter = function(jwtTimeStamp){
   if(this.passwordChangedAt){
       const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10) ;
       return jwtTimeStamp < changeTimeStamp ;
   }

   return false ;
}
userSchema.pre("save" , async function(next){
   const encryptedPassword = await bcrypt.hash(this.password , 12) ;
   this.password = encryptedPassword ;
   this.passwordConfirm = undefined ; 
   next() ;
})
const userModel = mongoose.model("users" , userSchema) ;

module.exports = userModel ;