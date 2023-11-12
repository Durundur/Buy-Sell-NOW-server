const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../../../utils/ensureAuthenticated');
const UserModel = require('../../../models/UserModel');
const cloudinary = require('../../../utils/uploadImages');
const formidableMiddleware = require('express-formidable');

router.get('/general-info', ensureAuthenticated, async function (req, res, next) {
	let requestUserId = req.session.passport.user.toString();
	try {
		const response = await UserModel.findOne({ _id: requestUserId }).select('-salt -hash -username');
		res.status(200).send(response);
	} catch (error) {
		return next(error);
	}
});

router.put('/general-info', ensureAuthenticated, async function (req, res, next) {
	let requestUserId = req.session.passport.user.toString();
	const { advertiser } = req.body;
	try {
		const updatedInfo = await UserModel.findByIdAndUpdate(requestUserId, { $set: { advertiser } }, { new: true });
		res.status(200).send({ data: updatedInfo.advertiser, message: 'Successfully changed info', success: true, status: 200 });
	} catch (error) {
		return next(error);
	}
});

router.put('/change-password', ensureAuthenticated, async function (req, res, next) {
	let requestUserId = req.session.passport.user.toString();
	try {
		const user = await UserModel.findById(requestUserId);
		await user.changePassword(req.body.oldPassword, req.body.newPassword);
		res.status(200).send({ message: 'Password has been changed', success: true, status: 200 });
	} catch (error) {
		return next(error);
	}
});


router.post('/change-images', ensureAuthenticated, formidableMiddleware(), async function (req, res, next) {
	let requestUserId = req.session.passport.user.toString();
	try {
		const user = await UserModel.findById(requestUserId);
		const files = req.files;
		const fields = req.fields
		if (Object.keys(fields).length > 0) {
			for (const field in fields) {
				if (fields[field] === '') {
					const res = await cloudinary.deleteImage(`${requestUserId}.${field}`);
					if (res.result === 'ok') {
						user[field] = null;
					}
				}
				if (user[field] === fields[field]) {
					continue;
				}
			}
		}
		if (Object.keys(files).length > 0) {
			const urls = await cloudinary.uploadImages(files, requestUserId);
			Object.keys(urls).map((url) => {
				user[url] = urls[url];
			})
		}
		const updatedUser = await user.save();
		res.status(200).send({ data: { avarar: updatedUser.avatar, banner: updatedUser.banner }, message: 'Images has been successfully changed', success: true, status: 200 });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
