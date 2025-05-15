const {promisify} = require('util') ;
const jwt = require('jsonwebtoken') ;
const dotenv = require('dotenv') ;
const userModel = require("../model/userModel") ;
const catchAsync = require("../utils/catchAsync") ;
const AppError = require('../utils/appErrors');

dotenv.config({path : "../config.env"}) ;

function assignToken(id){
     const token = jwt.sign({id} , process.env.JWT_STRING , {
         expiresIn : process.env.JWT_EXPIRY 
     }) ;  
     return token ;
}
exports.signup = catchAsync(async (req , res , next) => {
     const {name , email , photo , password , passwordConfirm , passwordChangedAt} = req.body ;
     const newUser = await userModel.create({
        name , email , photo , password , passwordConfirm , passwordChangedAt
     }) ;
     const token = assignToken(newUser._id) ; 
     return res.status(201).json({
         status : "success" ,
         token ,          
         data : newUser          
     })
})

exports.login = catchAsync(async (req , res , next) => {
     const {email , password} = req.body ;
     if(!email || !password){
         return res.status(400).json({
            status : 'failed' ,
            message : "Email and password is required"
         })
     } 
     
     // check if user with this email exists

     const userData = await userModel.findOne({email}).select("+password") ;
     if(!userData){
        next(new AppError('User not found' , 404))
     }

     if(userData && await userData.isPasswordValid(userData.password , password)){
        const token = assignToken(userData._id) ;
        res.status(201).json({
             status : "success" ,
             token ,
             message : "User logged in successfully"
        })
    }else{
        res.status(401).json({
             status : "failed" ,
             message : "Invalid credentials"
        })    
     }
})

exports.isTokenValid = catchAsync(async (req , res , next) => {
     // 1) check if token exists
      const {authorization} = req.headers ;
      const token = authorization ? authorization.split(" ")[1] : '' ;
      if(!token){
         return next(new AppError('Unauthorized' , 401)) ;
      }
      console.log("token : " , token) ;
     // 2) verify token
     const decoded = await promisify(jwt.verify)(token , process.env.JWT_STRING) ;
     console.log("decoded ====> " , decoded) ;
     // 3) check if user still exists
     const freshUser = await userModel.findById(decoded.id) ;
     if(!freshUser){
          return next(new AppError("User does not exist" , 404)) ;
     }
     // 4) check if password changed or not
     if(freshUser.changePasswordAfter(decoded.iat)){
         return next(new AppError("User recently changed password" , 401)) ;
     }

     req.user = freshUser ;
     next()
})

