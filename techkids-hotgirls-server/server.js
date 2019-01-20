const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const UserApi = require('./routers/userApi');

const PostApi = require('./routers/postApi');

const app = express();

mongoose.connect('mongodb://localhost/tk-hotgirls',{useNewUrlParser: true}, (err) =>{
    if (err) console.log(err)
    else console.log("DB connect success");
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use('/api/users', UserApi);

app.use('/api/posts', PostApi);

app.listen(6699, (err)=>{
    if (err) console.log(err);
    else console.log("Server start success!");
})
