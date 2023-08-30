const express = require('express')
const router = express.Router()
const ConversationChatModel = require('../../../models/ConversationChatModel')
const ConversationModel = require('../../../models/ConversationModel')
const ensureAuthenticated = require('../../../utils/ensureAuthenticated')
const UserModel = require('../../../models/UserModel')

router.get('/general-info', ensureAuthenticated,  async function (req, res, next) {
    let requestUserId = req.session.passport.user.toString();
    try{
        const response = await UserModel.findOne({_id: requestUserId}).select('-salt -hash -username');
        res.status(200).send(response);
    }catch(error){
        return next(error);
    }
})


router.put('/general-info', ensureAuthenticated,  async function (req, res, next) {
    let requestUserId = req.session.passport.user.toString();
    const {advertiser, localization} = req.body;
    try{
        const updatedSettings = await UserModel.findByIdAndUpdate(requestUserId, { $set: {advertiser, localization} }, { new: true })
        res.status(200).send({...updatedSettings._doc, redirect: '/'});
    }catch(error){
        return next(error);
    }
})

router.put('/change-password', ensureAuthenticated, async function (req, res, next) {
    let requestUserId = req.session.passport.user.toString();
    try{
        const user = await UserModel.findById(requestUserId);
        await user.changePassword(req.body.oldPassword, req.body.newPassword)
        res.status(200).send({message: 'Password has been changed'})
    }
    catch(error){
        return next(error)
    }
}) 


router.post('/change-images', ensureAuthenticated, async function (req, res, next) {
    let requestUserId = req.session.passport.user.toString();
    try{
        const user = await UserModel.findById(requestUserId);
        const {avatar, banner} = req.body;
        user.avatar = avatar;
        user.banner = banner;
        const updatedUser = await user.save();
        res.status(200).send({...updatedUser._doc , message: 'Images has been successfully changed'});
    }
    catch(error){
        return next(error)
    }
}) 

module.exports = router