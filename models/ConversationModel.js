const { mongoose } = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    advertiser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsersData'
    },
    inquirer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsersData'
    },
    ad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdsData',
    },
    lastMessage: {
        type: String
    }
}, {toJSON: {virtuals: true}, id: false})


module.exports = ConversationModel = mongoose.model('ConversationsData', ConversationSchema, 'ConversationsData')