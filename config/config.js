const mongoose = require("mongoose")


const connectDb = ()=>{
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.MONGO_URL)
   
    console.log("DB connected")
}

module.exports = connectDb
