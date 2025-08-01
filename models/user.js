const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}, {timestamps: true})

const User = model("User", userSchema)

module.exports = User