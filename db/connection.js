require("dotenv").config()
const mongoose = require("mongoose")
const config = {useUnifiedTopology: true, useNewUrlParser: true}
const {MONGODB_URI} = process.env

mongoose.connect(MONGODB_URI, config)

mongoose.connection
  .on("open", () => console.log("MONGO CONNECTION IS OPEN"))
  .on("close", () => console.log("MONGO CONNECTION IS CLOSED"))
  .on("error", (error) =>
    console.log("MONGO CONNECTION ERROR \n***************\n", error)
  );

module.exports = mongoose