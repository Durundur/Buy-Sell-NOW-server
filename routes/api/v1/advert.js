const express = require('express')
const router = express.Router()
const AdModel = require('../../../models/AdModel')
const ensureAuthenticated = require('../../../utils/ensureAuthenticated')
const mongoose = require("mongoose");
const UserModel = require('../../../models/UserModel');
const ADS_PER_PAGE = 5;
const uploadImages = require('../../../utils/uploadImages')
const formidableMiddleware = require('express-formidable');

router.get('/:id', async function (req, res, next) {
  try {
    const ad = await AdModel.findById(req.params.id).populate({ path: 'advertiser.details', select: ['-banner', '-username'], strictPopulate: false })
    if (ad === null) {
      res.status(404).end();
    }
    const adWithoutAdvertiser = ad.toJSON({ virtuals: true });
    const advertiserFields = ad.advertiser.details.advertiser;
    delete adWithoutAdvertiser.advertiser.details.advertiser;
    adWithoutAdvertiser.advertiser.details = { ...adWithoutAdvertiser.advertiser.details, ...advertiserFields };
    res.status(200).send(adWithoutAdvertiser)
  }
  catch (error) {
    next(error)
  }
})


router.put('/:id', ensureAuthenticated, formidableMiddleware(), async function (req, res, next) {
  let requestUserId = req.session.passport.user.toString();
  try {
    const ad = await AdModel.findById(req.params.id);
    if (ad.advertiser._id.toString() === requestUserId) {
      const filesToUpload = req.files;
      const uploadedFilesUrls = await uploadImages(filesToUpload, req.fields._id);
      const updatedAd = await AdModel.findByIdAndUpdate(req.params.id, { $set: {...req.fields, ...uploadedFilesUrls} }, { new: true });
      res.status(200).send({ ad: updatedAd, redirect: `/ogloszenie/${req.params.id}` });
    } else {
      res.status(403).send({ message: 'You are not authorized', redirect: '/logowanie' });
    }
  } catch (error) {
    next(error);
  }
});

//mozna wyswietlic strone do edycji, nie bedac wlascicielem ogloszenia, ale put sie nie uda
//albo po stronie clienta sprawdzić userID albo nowy endpoint

router.delete('/:id', ensureAuthenticated, async function (req, res, next) {
  let requestUserId = req.session.passport.user.toString();
  try {
    const ad = await AdModel.findById(req.params.id);
    if ((ad.advertiser._id).toString() === requestUserId) {
      await AdModel.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: 'Ad has been deleted successfully' })
    } else {
      res.status(403).send({ message: 'You are not authorized', redirect: '/logowanie' });
    }
  } catch (error) {
    next(error);
  }
})

router.post('/', ensureAuthenticated, formidableMiddleware(), async function (req, res, next) {
  let requestUserId = req.session.passport.user.toString();
  const newAd = new AdModel();
  const filesToUpload = req.files;
  const uploadedFilesUrls = await uploadImages(filesToUpload, newAd._id);
  newAd.$set({...req.fields, ...uploadedFilesUrls});
  newAd.advertiser._id = requestUserId;
  try {
    const newAdDoc = await newAd.save();
    res.status(200).send({ ad: newAdDoc, redirect: `/ogloszenie/${newAdDoc._id}` })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router