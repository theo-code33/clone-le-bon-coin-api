const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    number_address: {
        type: String
    },
    route: {
        type: String
    },
    postal_code: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    administrative_area_level_1: {
        type: String
    },
    administrative_area_level_2: {
        type: String
    },
    address: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
})

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;