const mongoose = require('mongoose') ;
const dotenv = require('dotenv') ;
const fs = require('fs') ;
const Tour = require('../../model/tourModel') ;

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json` , 'utf-8')) ;

//import data into DB

const importData = async () => {
    try{
        await Tour.create(tours) ;
        console.log('data imported successfully') ;
    }catch(err){
        console.log("err ====> " , err)
    }

    process.exit()
}

const deleteData = async () => {
    try{
       await Tour.deleteMany() ;
       console.log('Data deleted successfully') ;
    }catch(err){
        console.log("err ====> " , err)
    }

    process.exit()
}

if(process.argv[2] === "--import"){
   importData() ;
}else if(process.argv[2] === "--delete"){
   deleteData() ;
}

