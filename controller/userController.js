const userModel = require("../model/userModel")
const catchAsync = require("../utils/catchAsync")

exports.getAllUsers = catchAsync(async (req , res) => {
    const allUsers = await userModel.find() ;
    res.status(201).json({
        status : "success" ,
        data : allUsers 
    })
})
exports.getUser = (req , res) => {
    res.status(500).json({
        status : 'error' ,
        message : 'This route not yet defined'
    })
} 
exports.createUser = (req , res) => {
    res.status(500).json({
        status : 'error' ,
        message : 'This route not yet defined'
    })
} 
exports.updateUser = (req , res) => {
    res.status(500).json({
        status : 'error' ,
        message : 'This route not yet defined'
    })
}
exports.deleteUser = (req , res) => {
    res.status(500).json({
        status : 'error' ,
        message : 'This route not yet defined'
    })
} 
