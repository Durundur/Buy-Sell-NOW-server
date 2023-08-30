const { mongoose } = require("mongoose");

const ConversationChatSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'ConversationsData' },
    messages: {
        type: [{
                message: { type: String, },
                author: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersData' },
                timestamp: { type: Date, default: Date.now },
            }],
        default: undefined
    }
}, {toJSON: {virtuals: true} ,id: false});

ConversationChatSchema.virtual('conversation', {
    ref: 'ConversationsData',
    localField: '_id',
    foreignField: '_id',
    justOne: true,
})

module.exports = ConversationChatModel = mongoose.model('ConversationsChatData', ConversationChatSchema, 'ConversationsChatData')