const express = require('express');
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const mongoose = require("mongoose")

//db connection
const mongoUserName = "devuser";
const mongoPassword = "devpassword";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "react_notes";

var uri =
  "mongodb://" +
  mongoUserName +
  ":" +
  mongoPassword +
  "@" +
  mongoHost +
  ":" +
  mongoPort +
  "/" +
  mongoDatabase;

var options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  authSource: "admin"
};
mongoose.connect(uri,options)
.then(db => {
    console.log('db is connected');
})
.catch(err => {
    console.log(err);
    console.log('Error to connect database');
})

//static server
app.use(express.static('public'))

require('./sockets')(io)

server.listen(3001, () => {
    console.log('API listening on port 3001');
})