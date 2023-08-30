const express = require('express')
const router = express.Router()
const ConversationChatModel = require('../../../models/ConversationChatModel')
const ConversationModel = require('../../../models/ConversationModel')
const ensureAuthenticated = require('../../../utils/ensureAuthenticated')
const AdModel = require('../../../models/AdModel')

router.get('/:id', ensureAuthenticated, async function (req, res, next) {
  const conversationId = req.params.id;
  try {
    const chat = await ConversationChatModel.findOne({ _id: conversationId }).populate({
      path: 'conversation',
      select: ['ad'],
      strictPopulate: true,
      populate: {
        path: 'ad',
        select: ['tittle', 'advertiser.name', 'advertiser._id', 'images', 'price', '_id'],
        options: {
          perDocumentLimit: 1
        },
      }
    })
    res.status(200).send(chat)
  }
  catch (error) {
    next(error)
  }
})

router.post('/new-conversation', ensureAuthenticated, async function (req, res, next) {
  const requestUserId = req.session.passport.user.toString();
  const { adId }  = req.body;
  try{
    const ad = await AdModel.findById(adId);
    if( requestUserId === ad.advertiser._id.toString()) {
      throw {message: 'you can\'t start a converstaion with yourself', status: 403};
    }
    const conversation = await ConversationModel.findOne({ inquirer: requestUserId, ad: adId, advertiser: ad.advertiser._id });
    if(conversation === null) {
      const newConversation = new ConversationModel({inquirer: requestUserId, ad: adId, advertiser: ad.advertiser._id});
      const newConversationChat = new ConversationChatModel({_id: newConversation._id, messages: []})
      await newConversation.save();
      await newConversationChat.save();
      res.status(200).send({message: 'successfully created new conversation', redirect: `/moje-konto/wiadomosci/${newConversation._id}`})
    }else {
      res.status(303).send({redirect: `/moje-konto/wiadomosci/${conversation._id}`})
    }
  } catch(error){
    next(error)
  }
})

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