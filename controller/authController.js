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