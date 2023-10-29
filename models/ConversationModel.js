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
        message: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UsersData'
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        timestamp: {
            type: Date
        }
    }
}, {toJSON: {virtuals: true}, id: false})


module.exports = ConversationModel = mongoose.model('ConversationsData', ConversationSchema, 'ConversationsData')