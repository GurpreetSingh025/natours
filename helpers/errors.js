const AppError = require("../utils/appErrors");

function handleCastErrorDB(error){
    const message = `Invalid ${error.path} : ${error.value}` ;
    return new AppError(message , 400) ;
}
function errorHandleDev(err , res){
   res.status(err.statusCode).json({
       status : err.status ,
       err : err ,
       message : err.message ,
       stack : err.stack 
   })
}
function errorHandleProd(err , res){
    // Operational error , send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status : err.status ,
            message : err.message  
        })
    }else{
        // programming error message might be meaning less for client 
        // so send normal error statement
        res.status(500).json({
            status : err.status ,
            message : 'Smething went wrong' 
        })
    }
   
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === "development") {
        errorHandleDev(err , res) ;
    } else if (process.env.NODE_ENV === "production") {
        let error = {...err} ;
        if(error.name = "CastError"){
            error = handleCastErrorDB(error) ;
        }
        errorHandleProd(error , res) ;
    }
    // err.statusCode = err.statusCode || 500 ;
    // err.status = err.status || 'error' ;
    // res.status(err.statusCode).json({
    //      status : err.status ,
    //      message : err.message 
    // })
}