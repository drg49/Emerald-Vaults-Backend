const {Schema, model} = require("mongoose")

const postSchema = new Schema({
    realuser: {type: String, required: true},
    username: String, //This will either show up as the actual username above^ or it will show up as 'Anonymous'
    image: String,
    note: String,
    location: String
}, {timestamps: true})

const Post = model("Post", postSchema)

module.exports = Post 