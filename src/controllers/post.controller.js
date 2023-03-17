const Address = require("../models/address.model");
const Post = require("../models/post.model");
const UploadFile = require("../models/uploadFile.model");
const AwsS3_service = require("../utils/aws-s3");

const PostController = {
    async createPost(req, res) {
        const {
            title,
            content,
            number_address,
            route,
            postal_code,
            city,
            country,
            administrative_area_level_1,
            administrative_area_level_2,
            lat,
            lng,
            address
        } = req.body;
        const { files } = req;
        
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
        const { lng, lat } = req.query;
        try {
            if(lng && lat){
                const postList = await Post.find().populate("uploadFiles").populate({
                    path: 'address',
                    match: {
                        lat: {
                            $gt: Number(lat) - 0.1,
                            $lt: Number(lat) + 0.1
                        },
                        lng: {
                            $gt: Number(lng) - 0.1,
                            $lt: Number(lng) + 0.1
                        }
                    }
                });
                const postFiltered = postList.filter((post) => post.address !== null)
                res.send(postFiltered);
            }else{
                const postList = await Post.find().populate("uploadFiles").populate("address");
                if(!postList) return res.status(404).send("No Posts founds")
                res.send(postList);
            }
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
        console.log("req.body => ", req.body)
        const { id } = req.params;
        const { 
            title,
            content,
            number_address,
            route,
            postal_code,
            city,
            country,
            administrative_area_level_1,
            administrative_area_level_2,
            lat,
            lng,
            address
        } = req.body;

        const addressComponents = {
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
        }
        try {
            const post = await Post.findByIdAndUpdate(id, {title, content})
            if(!post) return res.status(404).send("Post not found")
            const address = await Address.findByIdAndUpdate(post.address._id, addressComponents)
            if(!address) return res.status(404).send("Address not found")
            res.send(post);
        } catch (error) {
            throw new Error(error);
        }

    },
    async deletePost(req, res) {
        const { id } = req.params;
        try {
            const post = await Post.findByIdAndDelete(id);
            if(!post) return res.status(404).send("Post not found")
            const address = await Address.findOneAndDelete({post: id});
            if(!address) return res.status(404).send("Address not found")
            const uploadFiles = await UploadFile.deleteMany({post: id});
            if(!uploadFiles) return res.status(404).send("UploadFiles not found")
            res.send({message: "Post deleted successfully"});
        } catch (error) {
            throw new Error(error);
        }
    },
  };
module.exports = PostController;