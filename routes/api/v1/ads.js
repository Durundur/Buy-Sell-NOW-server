const c = require('config')
const express = require('express')
const router = express.Router()
const AdModel = require('../../../models/AdModel')

router.get('/', async function (req,res, next){
  const page = req.query.p || 1;
  const adsPerPage = 10;
  try{
    const adsDocs = await AdModel.find().skip(adsPerPage * (page-1)).limit(adsPerPage)
    res.status(200).json(adsDocs)
  }
  catch(error){ 
    next(error)
  }
})

router.get('/:id', async function(req,res, next){
  try{
    const adDoc = await AdModel.findById(req.params.id)
    res.status(200).send(adDoc)
  }
  catch(error){
    next(error)
  }
})

router.put('/:id', async function(req,res, next){
  try{
    const updatedAdDoc = await AdModel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    res.status(200).json(updatedAdDoc)
  }
  catch(error){
    next(error)
  }
})

router.delete('/:id', async function(req,res, next){
  try{
    const deletedAdDoc = await AdModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Ad has been deleted')
  }
  catch(error){
    next(error)
  }
})

router.post('/', async function(req,res, next){
    const newAdDoc = new AdModel(req.body)
    console.log(newAdDoc)
    try{
      const savedAdDoc = await newAdDoc.save();
      res.status(200).json(savedAdDoc)
    }catch(error){
      console.log(error)
      next(error)
    }
})

module.exports = router