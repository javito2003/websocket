const path = require('path')
const express = require('express')
const http = require('http')
const app = express()
const {Server} = require("socket.io")

const server =http.createServer(app)
const io = new Server(server)

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

require('./ws')(io)

server.listen(3001, () => {
    console.log('Api listening on port 3001');
})