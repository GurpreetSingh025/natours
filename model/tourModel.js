const mongoose = require('mongoose');
const validator = require('validator') ;
// const slugify = require('slugify') ;

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true ,
        maxLength : [40 , 'Name cannot have more than 40 characters'] ,
        // validate : [validator.isAlpha , 'Tour name must only contain characters'] 
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have max group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'] ,
        enum : {values : ['easy' , 'medium' , 'difficulty'] , message : 'Difficulty is either easy medium or difficult'}
    },
    ratingAverage: {
        type: Number,
        default: 4.5 ,
        min : [1 , 'Value cannot be less than 1'] ,
        max : [5 , 'Value cannot be more than 5']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type : Number ,

        // Custom validators
        //either write custom validators or use a package which validates and sanitize
        // most famous package is validator.js
        validate : {
            validator : function(val) {
                // this keyword only point to document when we are creating a new document , it does not point to document in case of update
                if(this.price && this.price >= val){
                    return false ;
                }
                return true ;
            } ,
            message : 'Discount price ({VALUE}) should be less than regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        // required: [true, 'A tour must have cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    secretTour : {
       type : Boolean  ,
       default : false 
    } ,
    startDates: [Date]
},
{
    toJSON : { virtuals: true },
    toObject : {virtuals : true}
}
)
tourSchema.virtual('durationweeks').get(function () {
    return this.duration / 7;
})

// Document middlewares

//below functions only work in case of save and create not in case of update
tourSchema.pre('save' , function(next){
    console.log(this) // here this refers to document
    next() ;
}) 
tourSchema.post('save' , function(doc , next){
    console.log(doc) ;
    next() ;
})

// Query middleware
tourSchema.pre(/^find/ , function(next){
 console.log(this) // this refers query
 this.find({
    secretTour : {$ne : true}  
 })
 next() ;
}) 


const Tour = mongoose.model('Tour', tourSchema);
// const testTour = new Tour({
//     name : 'The Park Camper' ,
//     price : 997
// })
// testTour.save().then(doc => {
//     console.log(doc)
// }).catch(err => {
//     console.log("Error ====> " , err) ;
// })

module.exports = Tour;