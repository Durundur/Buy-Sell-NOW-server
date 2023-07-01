const express = require('express');
const router = express.Router();
const passport = require('passport')
const LocalStrategy   = require('passport-local-mongoose').Strategy
const UserModel = require('../../../models/UserModel')

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

router.post('/login', passport.authenticate('local'), function(req, res) {
	console.log(req.sessionID)
	res.end();
});


module.exports = router