const { mongoose } = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
    advertiser: {
        name: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        isCompanyAcc: {
            type: Boolean
        },
        aboutCompany: {
            type: String
        },
        companyWebsite: {
            type: String
        },
        address: {
            postcode: {
                type: String
            },
            street: {
                type: String
            },
            buildingNumber: {
                type: Number
            },
            //city or village
            city: {
                type: String
            },
            county: {
                type: String
            },
            state: {
                type: String
            },
            lat: {
                type: Number
            },
            lon: {
                type: Number
            }
        }

    },
    avatar: {
        type: String,
    },
    banner: {
        type: String,
    }
}, { timestamps: true })
UserSchema.plugin(passportLocalMongoose);
module.exports = UserModel = mongoose.model('UsersData', UserSchema, 'UsersData')