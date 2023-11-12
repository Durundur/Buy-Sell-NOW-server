const express = require('express')
const router = express.Router()
const UserModel = require('../../../models/UserModel');


router.get('/user/:id/info', async function (req, res, next) {
  const id = req.params.id
  try {
    const userInfo = await UserModel.findById(id).select('-hash -username -salt');
    res.status(200).send(userInfo)
  } catch (error) {
    next(error)
  }
})


module.exports = router