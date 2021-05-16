const Chat = require('./models/Chat')
module.exports = function(io){
    let users = []
    io.on('connection', async (socket) => {
        console.log('User connected');
        let messages = await Chat.find()
        socket.emit('loadOldMessages', messages)
        socket.on('new-user', (data, cb) => {
            if(data in users){
                cb(false)
            }else{
                cb(true)
                socket.nickname = data
                users[socket.nickname] = socket
                updateusers()
            }
        })

        socket.on('send-message', async(data, cb) => {

            var msg =data.trim()

            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ')
                if (index !== -1) {
                    var name = msg.substring(0, index)
                    var msg = msg.substring(index + 1)
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg: msg,
                            nickname: socket.nickname
                        })
                    }else{
                        cb('Error! Please enter a valid user')
                    }
                }else{
                    cb('Error! Please enter your message')
                }
            }else{
                var newMsg = new Chat({
                    nickname: socket.nickname,
                    msg: data
                })
                await newMsg.save()
                io.sockets.emit('new-message', {
                    msg: data,
                    nickname: socket.nickname
                })
            }

        })


        socket.on('disconnect', data => {
            if (!socket.nickname) {
                return
            }else{
                delete users[socket.nickname]
                updateusers()
            }
        })
    }) 

    function updateusers(){
        io.sockets.emit('usernames', Object.keys(users))
    }
}