const mongoose = require('mongoose');
// const slugify = require('slugify') ;

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true ,
        maxLength : [40 , 'Name cannot have more than 40 characters']
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
    priceDiscount: Number,
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
        required: [true, 'A tour must have cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    secretTour : {
       type : Boolean 
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
tourSchema.pre('save' , function(next){
    console.log(this) // here this refers to document
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
tourSchema.post('save' , function(doc , next){
    console.log(doc) ;
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