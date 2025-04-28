
const Tour = require('./../model/tourModel') ; // tour collection
const APIFeatures = require('../utils/apiFeatures') ;
const catchAsync = require("../utils/catchAsync") ;

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)) ;

exports.aliasTopTours = (req , res , next) => {
    try{
        req.query.sort = 'price,-ratingAverage' ; 
        req.query.fields = "name,price,ratingAverage,summary" ;   
        next() ;
    }catch(err){ 
         res.status(400).json({
             status : 'fail' ,
             message : 'Failed to get top 5 cheap tours'
         })
    }
}

exports.getAllTours = async (req , res) => {
    try{
    //   console.log('req.query ====> ' , req.query) ;

      // Build Query 
      
      // 1) Filtering
    //   const queryObj = {...req.query} ;  
    //   const excludedQueries = ['page' , 'sort' , 'limit' , 'fields'] ;      
    //   excludedQueries.forEach(el => delete queryObj[el]) ;
      
      // 2) Advanced Filtering      
      // duration[gte]=5

    //     let queryStr = JSON.stringify(queryObj) ;
    //     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , match => `$${match}`) ; 
      
    //   let query = Tour.find(JSON.parse(queryStr)) ; 
      
      // 3) Sort 

    //   if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ') ;
    //     query = query.sort(sortBy) ;
    //   }else{
    //      query = query.sort(req.query.createdAt) ; 
    //   }
   
      // 4) Limiting Fields
       
    //   if(req.query.fields){
    //      const fields = req.query.fields.split(',').join(' ') ;
    //      query = query.select(fields) ; 
    //   }else{ 
    //      query = query.select('-__v') ;
    //   }
      //   console.log('Query Fields:', query._fields);  

      // 5) Pagination

    //   const page = req.query.page * 1 || 1 ;
    //   const limit = req.query.limit * 1 || 100 ;
    //   const skip = (page - 1) * limit ;
    //   query = query.skip(skip).limit(limit) ;

    //   if(req.query.page){
    //       const totalDocs = await Tour.countDocuments() ;
    //       if(skip >= totalDocs){
    //           throw new Error('This page not exist') ;
    //       }
    //   }
    //   console.log('req.query : ' , req.query) ;
      const features = new APIFeatures(Tour.find() , req.query).filter().sort().limitFields().paginate() ;
      const allTours = await features.query ;
    //   query.sort().select().skip().limit() 
      
      return res.status(200).json({
          status : 'success' ,
          results : allTours.length ? allTours.length : 0 ,
          data : { 
              tours : allTours
          }
      })
    }catch(err){
        return res.status(404).json({
             status : 'fail' ,
             message : err.message ? err.message : err  
        })
    }
}

// param middleware function
// exports.checkID = (req , res , next , id) => {
//    console.log('check id middleware , value of id is : ' , req.params.id * 1)
//    if(req.params.id * 1 > tours.length){
//        return res.status(404).json({
//            status : 'fail' ,
//            message : 'Invalid ID'
//        })
//    }
//    next() 
// }

exports.getTourStats = async (req , res) => {
   try{
       const aggregateData = await Tour.aggregate([
           {
              $match : {
                duration : {
                     $gte : 4
                 }
              } 
            } , 
            {
              $group : {
                  _id : '$difficulty' ,
                  numTours : {
                      $sum : 1
                  } ,
                  numRatings : {
                      $sum : '$ratingQuantity'
                  } ,
                  avgRating : {
                      $avg : '$ratingAverage'
                  } ,
                  avgPrice : {
                      $avg : '$price'
                  } ,
                  minPrice : {
                      $min : '$price'
                  } ,
                  maxPrice : {
                       $max : '$price'
                  } 
              } ,
           } ,
           { 
              $sort : {
                  avgPrice : 1
              }       
           } ,
        
        //  below is to avoid one of the difficulty from db aggregation
        
        //    {
        //       $match : {
        //           _id : {
        //               $ne : 'easy'
        //           }
        //       }
        //    }
       ])
       return res.status(200).json({
            status : 'success' ,
            data : aggregateData
       })
   }catch(err){
       console.log('err ====> ' , err) ;
       res.status(400).json({
           status : 'fail' ,
           message : err.message || "Got some error"
       })
   }
}
exports.getMonthsTours = async (req ,res) => {
    try{
        const year = req.params.year * 1 ;
        const aggregateData = await Tour.aggregate([
            {
                $unwind : "$startDates" 
            } ,
            {
                $match : {
                    startDates : {
                         $gte : new Date(`${year}-01-01`) ,
                         $lte : new Date(`${year}-12-31`) 
                    }
                }
            } ,
            {
                $group : {
                     _id : {$month : '$startDates'} ,
                     numTours : {
                         $sum : 1
                     } ,
                     tourName :{$push : '$name'}
                }
            } ,
            {
                $addFields : {
                    month : '$_id'
                }
            } ,
            {
                $project : {
                    _id : 0
                }
            } ,
            {
                $sort : {
                    numTours: - 1
                }
            } ,
            {
                $limit : 6
            }

        ])
        return res.status(200).json({
            status : 'success' ,
            data : aggregateData
        })
    }catch(err){
         console.log('err ====> ' , err) ;
         return res.status(400).json({
              status : 'fail' ,
              message : err.message || 'Error fetching data'
         })
    }
}
exports.checkBody = (req , res , next) => {
    console.log("Inside check body middleware");
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status : "fail"
        })
    }
    
    next() ;
}

exports.getTour = catchAsync(async (req , res , next) => {
    const tour = await Tour.findById(req.params.id) ;
    // same as Tour.findOne({ _id : req.params.id })

    return res.status(200).json({
       status : "success" ,
       data : {
           tour
       }
    })
    // try{

    // }catch(err){
    //     // return res.status(404).json({
    //     //      status : 'fail' ,
    //     //      message : err
    //     // })
    //     next(err) ;
    // }
})
exports.createTour = async (req , res) => {
    try{
        if(req.body){
            const newTour = await Tour.create(req.body) ;
            return res.status(201).json({
                status : "success" ,
                data : {
                    tour : newTour
                }
            })
            
            // const newId = tours[tours.length - 1].id + 1 ;
            // tours.push(newTour) ;
            // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json` , JSON.stringify(tours) , err => {
            // })
        }
    }catch(err){
        console.log("err ====> " , err) ;
        return res.status(400).json({
            status : "fail" ,
            message : err.message ? err.message : err  
        })
    }
}
exports.updateTour = async (req , res) => {
    try{
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
            new : true ,
            runValidators : true 
        })
        return res.status(200).json({
            status : 'success' ,
            data : {
                tour : updatedTour
            }
        })
    }catch(err){
        return res.status(404).json({
            status : 'fail' ,
            message : err
        })
    }
}
exports.deleteTour = async (req , res) => {
    try{
        await Tour.findByIdAndDelete(req.params.id) ;        
        return res.status(204).json({
            status : "success" ,
            message : 'Deleted Successfully'
        })
    }catch(err){
        return res.status(400).json({
            status : 'fail' ,
            message : err
        })
    }
}