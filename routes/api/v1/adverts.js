const express = require('express')
const router = express.Router()
const AdModel = require('../../../models/AdModel')
const ensureAuthenticated = require('../../../utils/ensureAuthenticated')
const mongoose = require("mongoose");
const ADS_PER_PAGE = 5;


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



module.exports = router