const express = require('express');
const PostApi = express.Router();
const PostModel = require('../models/postModel');

// PostApi.use((req, res, next) =>{
//     console.log("Middleware");
//     next();
// });
//Read
PostApi.get('/', (req, res) =>{
    const { page=1, perPage=5 } = req.query;
    PostModel.find({})
    .select({__v: 0})
    .populate('author', '-_id -password -__v')
    .populate('comments.author', '-id -password -__v')
    .skip((page-1)*Number(perPage))
    .limit(Number(perPage))
    .then((posts) =>{
        res.send(posts);
    })
    .catch((err) =>{
        res.send({error: err});
    });
})

PostApi.get('/:postid', (req, res) =>{
    PostModel.findById(req.params.postid)
    .select({__v: 0})
    .populate('author', '-_id -password -__v')
    .populate('comments.author', '-id -password -__v')
    .then((postFound) =>{
        res.send({data:postFound});
    })
    .catch((err) =>{
        res.send({error: err});
    })
})

//Create
PostApi.post('/', (req, res) =>{
    const {picture, description, like, title, comments, views, author} = req.body;
    const newPost = {picture, description, like, title, comments, views, author};
    PostModel.init()
    .then(() =>{
        return PostModel.create(newPost);
    })
    .then((postCreated) =>{
        res.send({data: postCreated});
    })
    .catch((err) =>{
        res.send({error: err});
    })
})

//Update
PostApi.put('/:postid', (req, res) =>{
    console.log(req.body);
    const {description, title} = req.body;
    PostModel.findById(req.params.postid)
    .then((postFound) =>{
        postFound.description = description;
        postFound.title = title;
        return postFound.save();
    })
    .then((postUpdated) =>{
        res.send(postUpdated);
    })
    .catch((err) =>{
        res.send({error: err});
    })
})

//Delete
PostApi.delete('/:postid', (req, res) =>{
    PostModel.findByIdAndDelete(req.params.postid)
    .then(() =>{
        res.send({data: "Success!"});
    })
    .catch((err) =>{
        res.send({error: err});
    })
})


module.exports = PostApi;