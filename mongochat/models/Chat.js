const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    nickname: String,
    msg: String,
    created_at: {type: Date, default: Date.now()}    
})

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat