const Post = require("../models/post.model");
const AwsS3_service = require("../utils/aws-s3");

const PostController = {
    async createPost(req, res) {
        const { title, content } = req.body;
        const post = new Post({
        title,
        content
        })
        const { files } = req;
        console.log("files : ", files);

        const { Location } = await AwsS3_service(files[0]);

        try {
            await post.save();
            res.send(post);
        } catch (error) {
            throw new Error(error);
        }
    },
    async getPosts(req, res) {
        try {
            const posts = await Post.find();
            if(!posts) return res.status(404).send("No Posts founds")
            res.send(posts);
        } catch (error) {
            throw new Error(error);
        }
    },
    async getPost(req, res) {
        const { id } = req.params;
        try {
            const post = await Post.findById(id);
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