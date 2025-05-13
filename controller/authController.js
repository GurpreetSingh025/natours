const dotenv = require('dotenv') ;
const jwt = require('jsonwebtoken') ;
const User = require("../model/userModel") ;
const catchAsync = require("../utils/catchAsync")

dotenv.config({path : "../config.env"}) ;
exports.signUp = catchAsync(async (req , res, next) => {
    const newUser = await User.create(req.body) ;
    const token = jwt.sign({id : newUser._id} , process.env.JWT_STRING , {
        expiresIn : process.env.JWT_EXPIRE
    })
    res.status(201).json({
         status : 'success' ,
         token : token ,
         data : newUser
    })
})

exports.login = catchAsync(async (req , res , next) => {
    // get data send by user
    const userDetails = req.body ;
    // check if email and password is present
    const {email , password} = userDetails ;
    if(!email || !password){
        return res.status(400).json({
            status : 'failed' ,
            message : 'Email and password is required for login'
        })
    }
     
    const userData = await User.findOne({email}).select("+password") ;
    console.log("userData ====> " , userData) ;
    console.log("userData ====> " , userData.isPasswordValid) ;
    let token = jwt.sign({id : userData._id} , process.env.JWT_STRING , {
        expiresIn : process.env.JWT_EXPIRE
    })
    if(email == userData.email && await userData.isPasswordValid(password , userData.password)){
        res.status(201).json({
            status : "success" ,
            token ,
            data : userData 
        })
    }else{
        res.status(404).json({
             status : "Failed" ,
             message : "Invalid credentials"
        })
    }
})