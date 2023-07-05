const express = require('express');
const router = express.Router();
const passport = require('passport')
const LocalStrategy = require('passport-local-mongoose').Strategy
const UserModel = require('../../../models/UserModel')

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser(function(user, done){return done(null, user_id)}));
passport.deserializeUser(UserModel.deserializeUser(function(id, done){return done(null, getUserById(id))}));


const validateSession = (request) => {
	if(request.session.passport === null || request.session.passport === undefined) return false
	return true
}

router.get('/isAuth', async (req, res) => {
	let user = req.session.passport
	if (user) {
		return res.json({ message: "Authenticated Successfully", user });
	}else {
		return res.status(401).json({ message: "Unauthorized" });
	}
})

router.post('/login', passport.authenticate('local'), function (req, res) {
	let user = { userId: req.user._id }
	req.session.passport = user;
	res.status(200).send({ message: "Authenticated Successfully", user: user})
	res.end();
});


router.delete('/logout', function (req, res) {
	if(validateSession(req)){
		res.clearCookie("connect.sid").end();
		req.session.destroy();
	}
});



module.exports = router