const { mongoose } = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    // email:{
    //     type: String,
    //     required: true
    // }
})
UserSchema.plugin(passportLocalMongoose);
module.exports = UserModel = mongoose.model('UserData', UserSchema, 'UserData')