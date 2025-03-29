const mongoose = require('mongoose') ;
const dotenv = require('dotenv') ;
const app = require('./app') ; 

dotenv.config({path : `./config.env`})

const DB = process.env.DATABASE.replace("<db_password>" , process.env.DATABASE_PASSWORD)
mongoose.connect(DB , {
    useNewUrlParser : true ,
    useUnifiedTopology : true ,
    useCreateIndex : true ,
    useFindAndModify : false 
}).then(conn => {
    // console.log(conn.connection) ;
    console.log('DB connection successfull') ; 
}) 

const tourSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        unique : true 
    } ,
    rating : {
        type : Number ,
        default : 4.5 
    } ,
    price : {
        type : Number ,
        required : [true , 'A tour must have a price']
    }
})
// const Tour = mongoose.model('Tour' , tourSchema) ;
// const testTour = new Tour({
//     name : 'The Park Camper' ,
//     price : 997
// })
// testTour.save().then(doc => {
//     console.log(doc)
// }).catch(err => {
//     console.log("Error ====> " , err) ;
// })
const port = process.env.PORT ||  3000 ;
app.listen(port  , () => { 
    console.log(`listening to port ${port}`)
})
