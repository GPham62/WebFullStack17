const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/quyetde-17", {useNewUrlParser: true}, (err) => {
    if (err) console.log("DB connect fail!", err);
    else console.log("DB connect success!");
})

const QuestionModel = require("./models/questionModel");


app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (request, response) => {
    QuestionModel.countDocuments({}, (err, totalQuestion)=>{
        if (totalQuestion == 0) response.send("Chua co cau hoi nao !!");
        else{
        response.sendFile(__dirname + "/view/answer.html");
    }
    });
});

app.get("/api/random", (req,res) =>{
    QuestionModel.countDocuments({}, (err, totalQuestion) =>{
        QuestionModel
        .findOne({})
        .skip(Math.floor(Math.random() * totalQuestion))
        .exec((err, randomQuestion) => {
            if (err) console.log(err)
            else res.send({question: randomQuestion});
        });
    })
});

app.get("/question/:questionId", (req, res) => {
    res.sendFile(__dirname + "/view/question.html");
});

app.get("/api/question/:questionId", (req, res) => {
    const questionId = req.params.questionId;
    // QuesstionModel.findById(questionId, (err, questionFound) => {});
    QuestionModel.findOne({_id: questionId}).exec((err, questionFound) => {
        if (err) console.log(err)
        else if (!questionFound || !questionFound._id) res.status(404).send({ message: "Question not exist!"});
        else res.send({question: questionFound});
    });
})

app.get("/vote/:questionId/:vote", (req, res) => {
    //params
    const questionId = req.params.questionId;
    const vote = req.params.vote;
    // QuestionModel.findOneAndUpdate(
    //     {_id: questionId},
    //     {$inc: { [vote]: 1 }}, 
    //     (err, questionUpdated) => {
    //         if (err) console.log(err)
    //         else  res.send({ message: "Success"});
    // });
    QuestionModel.findOne({_id: questionId}, (err, questionFound) => {
        if (err) console.log(err);
        else if (!questionFound || !questionFound._id) res.status(404).send({ message: "Question not exist!"});
        else {
            questionFound[vote] += 1;
            questionFound.save((err) =>{
                if (err) console.log(err)
                else  res.send({ message: "Success"});
            });
        }
    })
});

app.get("/about", (req, res) =>{
    //Show ra trang CV
    res.sendFile(__dirname + "/resources/index.html");

});

app.get("/ask", (req, res) =>{
    res.sendFile(__dirname + "/view/ask.html");
});

app.post("/addquestion", (req, res) =>{
    QuestionModel.create({
        content: req.body.questionContent
    },
    (err, questionCreated) => {
        if (err) console.log(err);
        else res.redirect("/");
    });    
});

app.use(express.static("resources"));
//localhost:6969/public/...
app.use("/public",express.static("public"));

app.listen(6969, (err) => {
    if (err) console.log(err);
    else console.log("Server start success!");
});

