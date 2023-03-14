const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    postId: {
        ref: "Post",
        type: mongoose.Schema.Types.ObjectId,
    }
})

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;