const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    uploadFiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UploadFile"
    }]
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;