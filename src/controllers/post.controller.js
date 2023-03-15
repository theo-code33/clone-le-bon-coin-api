const Address = require("../models/address.model");
const Post = require("../models/post.model");
const UploadFile = require("../models/uploadFile.model");
const AwsS3_service = require("../utils/aws-s3");

const PostController = {
    async createPost(req, res) {
        console.log("body => ", req.body)
        const { title, content, number_address, route, postal_code, city, country, administrative_area_level_1, administrative_area_level_2, lat, lng, address } = req.body;
        const { files } = req;
        console.log(files)
        
        try {
            const post = new Post({
                title,
                content
            })
            const filesId = await Promise.all(files.map(async (file) => {
                const uploadFileInAws = await AwsS3_service(file, post._id);
                const uploadFile = new UploadFile({...uploadFileInAws , post: post._id})
                await uploadFile.save()
                return uploadFile._id;
            }))
            const addressPost = new Address({
                number_address: number_address,
                route: route,
                postal_code: postal_code,
                city: city,
                country: country,
                administrative_area_level_1: administrative_area_level_1,
                administrative_area_level_2: administrative_area_level_2,
                address: address,
                lat: lat,
                lng: lng,
                post: post._id
            })
            post.uploadFiles = filesId;
            post.address = addressPost._id;
            await addressPost.save();
            await post.save();
            res.send(post);
        } catch (error) {
            throw new Error(error);
        }
    },
    async getPosts(req, res) {
        try {
            const posts = await Post.find().populate("uploadFiles").populate("address");
            if(!posts) return res.status(404).send("No Posts founds")
            res.send(posts);
        } catch (error) {
            throw new Error(error);
        }
    },
    async getPost(req, res) {
        const { id } = req.params;
        try {
            const post = await Post.findById(id).populate("uploadFiles").populate("address");
            if(!post) return res.status(404).send("Post not found")
            res.send(post);
        } catch (error) {
            throw new Error(error);
        }
    },
    async updatePost(req, res) {
        const { id } = req.params;
        const { body } = req;

        try {
            const post = await Post.findByIdAndUpdate(id, body)
            if(!post) return res.status(404).send("Post not found")
            res.send(post);
        } catch (error) {
            throw new Error(error);
        }

    },
    async deletePost(req, res) {
        const { id } = req.params;
        try {
            const post = Post.findByIdAndDelete(id);
            if(!post) return res.status(404).send("Post not found")
            res.send(post);
        } catch (error) {
            throw new Error(error);
        }
    },
  };
module.exports = PostController;