
const express = require('express')
const router = express.Router()
const ConversationChatModel = require('../../../models/ConversationChatModel')
const ConversationModel = require('../../../models/ConversationModel')
const ensureAuthenticated = require('../../../utils/ensureAuthenticated')
const AdModel = require('../../../models/AdModel')


router.get('/', ensureAuthenticated, async function (req, res, next) {
  const requestUserId = req.session.passport.user.toString();
  try {
    const conversations = await ConversationModel
    .find({ $or: [{inquirer: requestUserId}, {advertiser: requestUserId}]  })
    .populate({
      path: 'ad',
      select: ['tittle', 'advertiser.name', 'advertiser._id', 'images'],
      populate: {
        path: 'advertiser.details', 
        select: ['avatar']
      }
    })
    .populate({path: 'inquirer', select: ['avatar', 'advertiser.name']})
    res.status(200).send(conversations)
  }
  catch (error) {
    next(error)
  }
})

module.exports = router