const express = require('express')
const cors = require('cors');
const multer = require('multer')
const fs = require('fs');
const db = require('./utils/db')
const adsRoutes = require('./routes/api/v1/ads')
const app = express()
const PORT = process.env.PORT || 7000 || $PORT 
const errorHandler = require('./utils/errorHandler')


app.use(express.static('static'))
app.use(cors({origin: true, credentials: true}));
app.use(express.json());

db.connect()
db.onDisconnectListener()
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})


app.use('/api/v1/ads', adsRoutes)
app.use(errorHandler);

// var storage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         //ensure that this folder already exists in your project directory
//         cb(null, "./static/public/data/");
//     },
//     filename: (req, file, cb)=>{
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({storage: storage})
// app.post('/upload-images',upload.array('imagesToUpload',12),(req,res)=>{
//     const uploadedFiles = []
//     for(let file of req.files){
//         uploadedFiles.push({
//             filename: file.filename,
//             url: 'http://localhost:7000/' + 'public/data/' + file.filename,
//             destination: file.destination + file.filename
//         })
//     }
//     // console.log(req.files)
//     res.send(uploadedFiles)
// })

// app.delete('/delete-image', async function (req,res){
//     fs.unlink(req.body.imagePath, (error)=>{
//         if (error) throw err;
//         console.log(req.body.imagePath, 'was deleted');
//     })
//     res.send()
// })




