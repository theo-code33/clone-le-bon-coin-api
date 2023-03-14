const mongoose = require("mongoose");

const uploadFileSchema = new mongoose.Schema({
    Etag: {
        type: String,
    },
    ServerSideEncryption: {
        type: String
    },
    Location: {
        type: String
    },
    key: {
        type: String
    },
    Key: {
        type: String
    },
    Bucket: {
        type: String
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
})

const UploadFile = mongoose.model("UploadFile", uploadFileSchema);

module.exports = UploadFile;