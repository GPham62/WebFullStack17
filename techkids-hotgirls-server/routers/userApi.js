const express = require("express");
const UserApi = express.Router();
const UserModel = require('../models/userModel');

//Middleware
UserApi.use((req, res, next) =>{
    console.log("Middleware");
    next();
});

//CRUD - Create, read, update, delete

//Read all users localhost:6699/api/users/?page=1&per_page=5
UserApi.get('/', (req, res) => {
    const { page=1, perPage=5 } = req.query; //gia tri mac dinh khi k cho vao //req.query doc request dang ?...
    // const perPage = 5;
    UserModel.find({})
    // .select({
    //     password: 0,
    //     __v : 0
    // })
    .select('-__v')
    .skip((page-1)*Number(perPage))
    .limit(Number(perPage))
    .then((users) =>{
        res.send({data :users});
    })
    .catch((err) =>{
        res.send({error : err});
    });
});

//Read user by id
UserApi.get('/:userId', (req, res) =>{
    const {userId} = req.params;
    UserModel.findById(userId)
    .then((userFound) => {
        res.send({data: userFound});
    })
    .catch((error) =>{
        res.send({error});
    });
});

//Create user
UserApi.post('/', (req, res) =>{
    const { username, password, avatar } = req.body;
    const newUsers = { username, password, avatar };
    UserModel.init()
        .then(() =>{
            return UserModel.create(newUsers);
        })
        .then((userCreated) =>{
            res.send({data: userCreated});
        })
        .catch((error) =>{
            res.send({error});
        });
});

//Update user
UserApi.put('/:userId', (req, res) =>{
    const {userId} = req.params;
    const {password, avatar} = req.body;
    UserModel.findById(userId)
    .then((userFound) =>{
        if (!userFound) res.send({error: "user not exist!"})
        else {
            userFound.password = password;
            userFound.avatar = avatar;
            return userFound.save();
        }
    })
    .then((userUpdated) =>{
        res.send({data: userUpdated});
    })
    .catch((error) => {
        res.send({error});
    });
});

//Delete user
UserApi.delete('/:userId', (req, res) =>{
    const {userId} = req.params;
    UserModel.findByIdAndRemove(userId)
        .then(() =>{
            res.send({data: "Success"});
        })
        .catch((error) =>{
            res.send({error});
        });
});

module.exports = UserApi;
