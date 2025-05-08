const mongoose = require('mongoose') ;
const bcrypt = require('bcryptjs') ;

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'Name is required'] 
    } ,
    email : {
        type : String ,
        required : [true , 'Email is required'] ,
        unique : true ,
        validate : {
            validator : function(val) {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                 if(regex.test(val)){
                     return true 
                 }else{
                    return false 
                 }
            }
        }
    } ,
    photo : {
        type : String ,
        required : false 
    } ,
    password : {
        type : String ,
        reqiured : [true , "Password is required"] ,
        minlength : 8 
    } ,
    passwordConfirm : {
        type : String ,
        reqiured : [true , 'Confirm password is required , value must be same as password'] ,
        validate : {
            validator : function(val){
                // only run in case of create and save
                 const pass = this.password ;
                 if(pass === val){
                     return true ;
                 }else{
                    return false ;
                 }
            } ,
            message : "Confirm password must be same as password"
        }
    }

})

userSchema.pre('save' , async function(next){
      // this runs only when password is actually modified
     if(!this.isModified('password')) return next() 
     
     this.password = await bcrypt.hash(this.password , 12) ;
     this.passwordConfirm = undefined ;
})

const userModel = new mongoose.model("users" , userSchema) ;
module.exports = userModel ;

