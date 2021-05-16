const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


//get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//JOIN CHATROOM
socket.emit('joinRoom', {username, room})

//GET ROOM USERS
socket.on("roomUsers", ({room,users}) => {
    outputRoomName(room)
    outputUsers(users)
})

//SERVER MESSAGE
socket.on("message", (data) => {
  console.log(data);
  outputMessage(data);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //get message text
  const msg = e.target.elements.msg.value;
  console.log(msg);
  //emit message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
});

//output message
function outputMessage(data) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${data.username} <span>${data.time}</span></p>
    <p class="text">
        ${data.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}



//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room
}

//Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}