const {Schema, model} = require("mongoose")

const postSchema = new Schema({
    name: String,
    image: String,
    note: String,
    location: String
}, {timestamps: true})

const Post = model("Post", postSchema)

module.exports = Post 