const express = require('express')
const cors = require('cors');
const multer = require('multer')
const bodyParser = require("body-parser");


const app = express()
const PORT = 7000

const connectDB = require('./db')
const adsPath = require('./routes/v1/api/ads')


app.use(cors({ origin: true }));
app.use(express.json());



// app.use('/public',express.static('public'));

connectDB()

app.use('/v1/api/ads', adsPath)
app.use(express.static('static'))


var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        //ensure that this folder already exists in your project directory
        cb(null, "./static/public/data/");
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage})



app.post('/upload-images',upload.array('imagesToUpload',12),(req,res)=>{
    const uploadedFiles = []
    for(let file of req.files){
        uploadedFiles.push({
            filename: file.filename,
            destination: 'http://localhost:7000/' + 'public/data/' + file.filename
        })
    }
    console.log(res)
    res.send(uploadedFiles)
})


app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})


