const express = require('express')
const router = express.Router()
const AdModel = require('../../../models/AdModel')
const ensureAuthenticated = require('../../../utils/ensureAuthenticated')
const mongoose = require("mongoose");
const UserModel = require('../../../models/UserModel');
const ADS_PER_PAGE = 5;
const uploadImages = require('../../../utils/uploadImages')

const formidableMiddleware = require('express-formidable');


router.get('/search/:mainCatParam?/:subCatParam?/:subSubCatParam?', async function (req, res, next) {
  const queryParams = new URLSearchParams(req.query);
  const page = queryParams.get('page') || 1;
  const tittle = queryParams.get('tittle');
  const city = queryParams.get('city');
  const state = queryParams.get('state');
  const county = queryParams.get('county');

  const queryFilter = {};
  if (tittle) queryFilter['tittle'] = { $regex: new RegExp(tittle, 'i') };
  if (city && state) {
    queryFilter['address.city'] = city;
    queryFilter['address.state'] = state;
    if (county) {
      queryFilter['address.county'] = county;
    }
  }

  const { mainCatParam, subCatParam, subSubCatParam } = req.params
  if (mainCatParam) {
    queryFilter.mainCategory = mainCatParam;
    if (subCatParam) {
      queryFilter.subCategory = subCatParam;
      if (subSubCatParam) queryFilter.subSubCategory = subSubCatParam;
    }
  }
  try {
    const ads = await AdModel.find(queryFilter).skip(ADS_PER_PAGE * (page - 1)).limit(ADS_PER_PAGE);
    res.status(200).send(ads)
  }
  catch (error) {
    next(error)
  }
})

router.get('/promoted', async function (req, res, next) {
  try {
    const ads = await AdModel.find()
    res.status(200).send(ads)
  }
  catch (error) {
    next(error)
  }
})


router.get('/user', ensureAuthenticated, async function (req, res, next) {
  let requestUserId = req.session.passport.user.toString();
  const page = req.query.page || 1;
  try {
    const ads = await AdModel.find({ "advertiser._id": requestUserId }).skip(ADS_PER_PAGE * (page - 1)).limit(ADS_PER_PAGE);
    res.status(200).send(ads);
  }
  catch (error) {
    next(error);
  }
});



router.get('/user/:id/stats', async function (req, res, next) {
  const userId = req.params.id
  try {
    const ads = await AdModel.aggregate([{
      $match: {
        'advertiser._id': new mongoose.Types.ObjectId(userId)
      }
    }, {
      $group: {
        _id: {
          mainCategory: '$mainCategory',
          subCategory: '$subCategory',
          subSubCategory: '$subSubCategory'
        },
        count: { $count: {} },
      }
    },
    ])
    let totalCount = 0;
    let stats = ads.reduce((result, item) => {
      totalCount += item.count;
      const { mainCategory, subCategory, subSubCategory } = item._id;
      let mainCategoryEntry = result.find((entry) => entry.name === mainCategory);
      if (!mainCategoryEntry) {
        mainCategoryEntry = { name: mainCategory, count: 0, subCategory: [] };
        result.push(mainCategoryEntry)
      }
      mainCategoryEntry.count += item.count;
      let subCategoryEntry = mainCategoryEntry.subCategory.find((entry) => entry.name === subCategory);
      if (!subCategoryEntry) {
        subCategoryEntry = { name: subCategory, count: 0, subSubCategory: [] }
        mainCategoryEntry.subCategory.push(subCategoryEntry);
      }
      subCategoryEntry.count += item.count;
      subCategoryEntry.subSubCategory.push({ name: subSubCategory, count: item.count })
      return result;
    }, [])

    res.status(200).send({ stats, totalCount })
  }
  catch (error) {
    next(error)
  }
})

router.get('/user/:id/info', async function (req, res, next) {
  const id = req.params.id
  try {
    const userInfo = await UserModel.findById(id).select('-hash -username -salt');
    res.status(200).send(userInfo)
  } catch (error) {
    next(error)
  }
})


router.get('/user/:id/:mainCatParam?/:subCatParam?/:subSubCatParam?', async function (req, res, next) {
  const { mainCatParam, subCatParam, subSubCatParam } = req.params
  const categoryQuery = {};
  if (mainCatParam) {
    categoryQuery.mainCategory = mainCatParam;
    if (subCatParam) {
      categoryQuery.subCategory = subCatParam;
      if (subSubCatParam) categoryQuery.subSubCategory = subSubCatParam;
    }
  }
  const userId = req.params.id;
  const page = req.query.page || 1;
  const sort = req.query.sort || '';
  const order = req.query.order || '';
  const sortArr = (sort && order) ? [sort, order] : []
  try {
    const ads = await AdModel.find({ "advertiser._id": userId, ...categoryQuery }).skip(ADS_PER_PAGE * (page - 1)).limit(ADS_PER_PAGE).sort([sortArr]);
    res.status(200).send(ads)
  }
  catch (error) {
    next(error)
  }
})


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
  const newAd = new AdModel(req.body)
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