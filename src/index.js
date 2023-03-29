require("dotenv").config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const port = process.env.PORT || 8000;
const connectDB = require('./config/mongo.config');
const postRouter = require('./routers/post.router');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors('*'));
app.use('/api/posts', postRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
.keepAliveTimeout = 500;