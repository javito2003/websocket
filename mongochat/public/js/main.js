$(function(){
    var socket = io()

    //geting DOM elements from the interface
    const $messageForm = $('#message-form')
    const $messageBox = $('#message')
    const $chat = $('#chat')


    //obtaining DOM elements from the nicknameForm
    const $nickForm = $('#nickForm')
    const $nickname = $('#nickname')
    const $nickError = $('#nickError')

    const $users = $('#usernames')

    $nickForm.submit(e => {
        e.preventDefault()
        socket.emit('new-user', $nickname.val(), (data) =>  {
            if(data){
                $('#nickWrap').hide()
                $('#contentWrap').show()
            }else{
                $nickError.html(`
                    <div class="alert alert-danger">That username already exits</div>
                `)
            }
            $nickname.val()
        })
    })

    //event
    $messageForm.submit(e => {
        e.preventDefault()
        socket.emit('send-message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        })
        $messageBox.val('')
    })

    socket.on('usernames', data => {
        let html = '';
        for(i = 0; i < data.length; i++) {
          html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`; 
        }
        $users.html(html);
      });

    socket.on('new-message', (data) => {
            $chat.append('<b>'+data.nickname+'</b>: '+ data.msg + '<br/>')
    })
    socket.on('whisper', (data) => {
        $chat.append(`<p class="whisper"><b>${data.nickname}: </b> ${data.msg}</p>`)
    })

    socket.on('loadOldMessages', data => {
        for (let i = 0; i < data.length; i++){
            displayMessage(data[i])
        }
    })
    

    function displayMessage(data){
        $chat.append('<b>'+data.nickname+'</b>: '+ data.msg + '<br/>')
    }
})