const express = require('express');
const PostApi = express.Router();
const PostModel = require('../models/postModel');

//Read
PostApi.get('/', (req, res) =>{
    PostModel.find({})
    .then((posts) =>{
        res.send(posts);
    })
    .catch((err) =>{
        res.send({error: err});
    });
})

PostApi.get('/:postid', (req, res) =>{
    PostModel.findById(req.params.postid)
    .then((postFound) =>{
        res.send(postFound);
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
    const {picture, description, like, title, comments, views, author} = req.body;
    PostModel.findById(req.params.postid)
    .then((postFound) =>{
        postFound.picture = picture;
        postFound.description = description;
        postFound.like = like;
        postFound.title = title;
        postFound.comments = comments;
        postFound.views = views;
        postFound.author = author;
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