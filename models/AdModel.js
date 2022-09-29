const mongoose = require('mongoose')

const adSchema = new mongoose.Schema({
    tittle: {
        type: String
    },
    location: {
        type: String
    },
    creationDate: {
        type: String
    },
    images: [{
        destination: String,
        filename: String,
        url: String
    }],
    price: {
        type: Number
    },
    currency: {
        type: String
    },
    isNegotiable: {
        type: Boolean
    },
    description: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    name: {
        type: String
    },
    category: {
        type: String
    }
})

module.exports = AdModel = mongoose.model('AdModel', adSchema)