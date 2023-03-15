const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });

router.post('/', upload.array('files', 8), PostController.createPost);
router.get('/', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.put('/:id', upload.array('files', 8), PostController.updatePost);
router.delete('/:id', PostController.deletePost);

module.exports = router;