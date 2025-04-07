const mongoose = require('mongoose') ;

const tourSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        unique : true 
    } ,
    duration : {
       type : Number ,
       required : [true , 'A tour must have duration']
    } ,
    maxGroupSize : {
       type : Number ,
       required : [true , 'A tour must have max group size']
    } ,
    difficulty : {
        type : String ,
        required : [true , 'A tour must have a difficulty']
    } ,
    ratingAverage : {
        type : Number ,
        default : 4.5 
    } ,
    ratingQuantity : {
        type : Number ,
        default : 0 
    } ,
    price : {
        type : Number ,
        required : [true , 'A tour must have a price']
    } ,
    priceDiscount : Number ,
    summary : {
        type : String  ,
        trim : true ,
        required : [true , 'A tour must have a summary']
    } ,
    description : {
        type : String ,
        trim : true 
    } ,
    imageCover : {
        type : String ,
        required : [true , 'A tour must have cover image']
    } ,
    images : [String] ,
    createdAt : {
        type : Date ,
        default : Date.now() 
    } ,
    startDates : [Date]
})
const Tour = mongoose.model('Tour' , tourSchema) ;
// const testTour = new Tour({
//     name : 'The Park Camper' ,
//     price : 997
// })
// testTour.save().then(doc => {
//     console.log(doc)
// }).catch(err => {
//     console.log("Error ====> " , err) ;
// })

module.exports = Tour ;