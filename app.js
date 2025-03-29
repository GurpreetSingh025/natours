const express = require('express') ;
const morgan = require('morgan') ;

const tourRouter = require("./routes/tourRoutes") ;
const userRouter = require("./routes/userRoutes") ;

const app = express() ;

console.log(process.env.NODE_ENV) ;
// Middlewares
if(process.env.NODE_ENV == "development"){
    app.use(morgan('dev')) ;
}
app.use(express.json()) ;
app.use(express.static(`${__dirname}/public`)) ; 

// middleware functions 

app.use((req , res , next) => {
    console.log("My own middleware") ;
    next() ;
})

//  Routes

// we can either write each request one by one where we have to write url again and again

// app.get("/api/v1/tours" , getAllTours)
// app.get("/api/v1/tours/:id" , getTour)
// app.post("/api/v1/tours" , createTour)
// app.patch("/api/v1/tours/:id" , updateTour)
// app.delete("/api/v1/tours/:id" , deleteTour)


// or we can write url one time and chain each http request
// app.route("/api/v1/tours").get(getAllTours).post(createTour)

// app.route("/api/v1/tours/:id").get(getTour).patch(updateTour).delete(deleteTour) ;

// app.route('/api/v1/users').get(getAllUsers).post(createUser) ;
// app.route("/api/v1/users/:id").get(getUser).delete(deleteUser) ;


//Below is called Mounting , we are mounting a new router on a route

app.use("/api/v1/tours" , tourRouter) ;
app.use("/api/v1/users" , userRouter) ;

module.exports = app ;

