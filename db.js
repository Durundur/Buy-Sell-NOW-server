const mongoose = require('mongoose')
const config = require('config')
const dbURI = config.get('dbURI')


const connectDB = async ()=>{
    try{
        await mongoose.connect(dbURI)
        console.log('DB is connected')
    }
    catch(e){
        console.log(e)
    }
}

module.exports = connectDB;
