const dotenv = require('dotenv') ;
dotenv.config({path : `./config.env`})
const errorHandleDev = (err , res) => {
    res.status(err.statusCode).json({
        status : 'fail' ,
        error : err , 
        message : err.message 
   })
} 
const errorHandleProd = (err , res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status : false ,
            message : err.message 
       })
    }else{
        res.status(err.statusCode).json({
             status : false ,
             message : 'Got some error'
        })
    }
}
const globalError = (err , res) => {
    err.statusCode = err.statusCode || 500  ;  // 500 means internal server error
    err.status = err.status || "error" ; 
    if(process.env.NODE_ENV === "development"){
        errorHandleDev(err , res)
    }else if(process.env.NODE_ENV === "production"){
        errorHandleProd(err , res)
    }
} 
module.exports = globalError ;