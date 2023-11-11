const ensureAuthenticated = require('../../../utils/ensureAuthenticated');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local-mongoose').Strategy;
const UserModel = require('../../../models/UserModel');

passport.use(UserModel.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
	UserModel.findById({ _id: _id }, function (err, user) {
		done(err, user);
	});
});

router.get('/ensure-auth', ensureAuthenticated, async function (req, res, next) {
	const userId = req.session.passport.user.toString();
	const user = await UserModel.findById(userId);
	res.status(200).send({ userId: userId, avatar: user?.avatar, message: 'You are authorized', status: 200, success: true });
});

router.post('/login', function (req, res, next) {
	passport.authenticate('local', function (err, user, info, status) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next({ ...info, status: 401 });
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(loginErr);
			}
			return res
				.status(200)
				.send({ status: 200, success: true, message: 'Authentication succeeded', userId: req.session.passport.user, avatar: user?.avatar, redirect: '/' });
		});
	})(req, res, next);
});

router.post(
	'/register',
	function (req, res, next) {
		UserModel.register(
			new UserModel({ username: req.body.username, advertiser: { name: '', phoneNumber: '', address: {city: '',state: '',county: '',lat: '',lon: ''}, isCompanyAcc: false } }), req.body.password,
			function (err, user) {
				if (err) {
					return next(err);
				}
				next();
			}
		);
	},
	function (req, res, next) {
		const authenticate = passport.authenticate('local');
		authenticate(req, res, function () {
			res.status(200).send({ status: 200, success: true, message: 'Authentication succeeded', userId: req.session.passport.user, redirect: '/' });
		});
	}
);

router.delete('/logout', function (req, res) {
	req.session.destroy();
	res.clearCookie('session_id').end();
});

module.exports = router;
