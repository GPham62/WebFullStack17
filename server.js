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

// app.get("/style.css", (req, res) =>{
//     res.sendFile(__dirname + "/resources/style.css");
// });

// request GET => http://localhost:6969/
app.get("/", (request, response) => {
    // const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    QuestionModel.count({}, (err, totalQuestion)=>{
        if (totalQuestion == 0) response.send("Chua co cau hoi nao !!");
        else{
        // var i = Math.floor(Math.random() * questions.length);
        // const randomQuestion = questions[i];
         // response.send(JSON.stringify({a:5, b:6}));
        // response.send(`<h1>
        // ${
        //      randomQuestion.content
        // }
        //  </h1>
        //  <a href="/vote/${randomQuestion.id}/yes"><button type="submit" name="vote" value="yes">Đúng/Có/Phải</button></a>
        //  <a href="/vote/${randomQuestion.id}/no"><button type="submit" name="vote" value ="no">Sai/Không/Trái</button></a>
        // `);
        response.sendFile(__dirname + "/view/answer.html");
    }
    });
});

app.get("/api/random", (req,res) =>{
    // const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    // const randomQuestion =  questions[Math.floor(Math.random() * questions.length)];
    // res.send({question: randomQuestion});

    //MongoDB
    // QuestionModel.find({}, (err, questions)=>{
    //     if (err) console.log(err);
    //     else {
    //         const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    //         res.send({question: randomQuestion});
    //     }
    // })

    QuestionModel.count({}, (err, totalQuestion) =>{
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
    QuestionModel.findOne({_id: questionId}).exec((err, questionFound) => {
        if (err) console.log(err)
        else res.send({question: questionFound});
    });
    // const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    // questions.forEach((question, index) => {
    //     if (question.id == questionId){
    //         questionFound = question;
    //     }
    // });
    // res.send({question: questionFound});
})

app.get("/vote/:questionId/:vote", (req, res) => {
    // const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    //params
    const questionId = req.params.questionId;
    const vote = req.params.vote;
    QuestionModel.findOne({_id: questionId}, (err, questionFound) => {
        if (err) console.log(err);
        else {
            questionFound.set({vote: questionFound[vote] ++});
            questionFound.save();
            res.redirect("/");
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
    // const questions = JSON.parse(fs.readFileSync("./questions.json", {encoding: "utf-8"}));
    // console.log(questions);
    // const newQuestion = {
    //     content: req.body.questionContent
    // };
    // questions.push(newQuestion);
    // console.log(questions);
    // fs.writeFileSync("./questions.json", JSON.stringify(questions));
    // res.redirect("/");
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

