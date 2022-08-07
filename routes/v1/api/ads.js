const express = require('express')
const router = express.Router()
const AdModel = require('../../../models/AdModel')


router.get('/all', async function (req,res){
  try{
    const data = await AdModel.find()
    res.send(data)
  }
  catch(error){ 
    res.send(error)
  }
})

router.get('/:id', async function(req,res){
  try{
    const data = await AdModel.findById(req.params.id)
    res.send(data)
  }
  catch(error){
    res.send(error)
  }

})

router.post('/add', function(req,res){
    AdModel.create(req.body)
    .then(ad => res.json({ msg: 'added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add' }));
})

module.exports = router