const fs = require('fs') ;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)) ;
exports.getAllTours = (req , res) => {
    res.status(200).json({
        status : 'success' , 
        results : tours.length ,
        data : {tours} ,         
    })
}

// param middleware function
exports.checkID = (req , res , next , id) => {
   console.log('check id middleware , value of id is : ' , req.params.id * 1)
   if(req.params.id * 1 > tours.length){
       return res.status(404).json({
           status : 'fail' ,
           message : 'Invalid ID'
       })
   }
   next()
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

exports.getTour = (req , res) => {
    const id = req.params.id * 1 ; 
    const tour = tours.find((el) => el.id === id) ;
    res.status(200).json({
       status : "success" ,
       data : {
           tour
       }
    })

}
exports.createTour = (req , res) => {
    if(req.body){
        const newId = tours[tours.length - 1].id + 1 ;
        const newTour = Object.assign({id : newId} , req.body) ;
        tours.push(newTour) ;
        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json` , JSON.stringify(tours) , err => {
           return res.status(201).json({
                status : "success" ,
                data : {
                    tour : newTour
                }
            })
        })
    }
}
exports.updateTour = (req , res) => {
    res.status(200).json({
        status : "success" ,
        data : {
             tour : '<Updated Tours ...>'
        }
    })
}
exports.deleteTour = (req , res) => {
    res.status(204).json({
        status : "success" ,
        data : null
    })
}