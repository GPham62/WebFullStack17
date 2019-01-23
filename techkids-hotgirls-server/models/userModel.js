const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: {type: String},
    avatar: {type: String}
});

UserSchema.pre("save", function(next){
    console.log(this);
    const {password} = this;
    if (this.isModified("password")){
        const salt = bcrypt.genSaltSync();
        this.password =bcrypt.hashSync(password, salt);
    }
    next();
})

module.exports = mongoose.model("user", UserSchema);