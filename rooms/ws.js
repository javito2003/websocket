const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, getRoomsUsers, userLeave } = require("./utils/users");

module.exports = function (io) {
  let botName = "Chatcord bot";

  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));

      //Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit("message", formatMessage(botName, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomsUsers(user.room)
        })
    });
    //Run when client connects

    //listen for chatMessage
    socket.on("chatMessage", (data) => {
        const user = getCurrentUser(socket.id)

      io.to(user.room).emit("message", formatMessage(user.username, data));
    });

    //runs when client disconnectssocket.on('disconnect', () => {
    socket.on("disconnect", () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit("message", formatMessage(botName,  `${user.username} has leave the room`));
        }
    });
  });
};
