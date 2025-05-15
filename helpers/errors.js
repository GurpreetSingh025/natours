const AppError = require("../utils/appErrors");

function handleCastErrorDB(error) {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
}

function handleUniqueValueErrorDB(err) {
    const message = `${err.keyValue.name} value has to be unique`;
    return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
    // console.log('handleValidationErrorDB ====>');
    const fieldName = Object.keys(err.errors).map(val => val);
    // console.log('fieldName ====>', fieldName);
    const message = `Invalid value of ${fieldName.join(', ')}`; // Changed . to , for clarity
    return new AppError(message, 400);
}
function handleJWTError(){
    return new AppError("Invalid token" , 401) ;
}
function handleJWTExpireError(){
    return new AppError("Expired token , please login again" , 401) ;   
}

function errorHandleDev(err, res) {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        err: err,
        message: err.message,
        stack: err.stack
    });
}

function errorHandleProd(err, res) {
    // console.log('inside errorHandleProd ====>');
    // console.log('err ====>', err);
    if (err.isOperational) {
        res.status(err.statusCode || 400).json({
            status: err.status || 'fail', // Use 'fail' for 4xx errors
            message: err.message
        });
    } else {
         // Log non-operational errors
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "development") {
        errorHandleDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err , message : err.message , name : err.name };
        if (error.name === "CastError") {
            error = handleCastErrorDB(error);
        } else if (error.code === 11000) {
            error = handleUniqueValueErrorDB(error);
        } else if (error.name === "ValidationError") {
            error = handleValidationErrorDB(error);
        }else if(error.name === "JsonWebTokenError"){
            error = handleJWTError() ;
        }else if(error.name === "TokenExpiredError"){
            error = handleJWTExpireError() ; 
        }
        errorHandleProd(error, res);
    }
    // Remove next() to prevent further middleware execution
};