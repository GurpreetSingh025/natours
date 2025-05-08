const userModel = require("../model/userModel") ;
const catchAsync = require("../utils/catchAsync") ;

exports.signup = catchAsync(async (req , res , next) => {
     const newUser = await userModel.create(req.body) ;
     return res.status(201).json({
         status : "success" ,
         data : newUser
     })
})
