//Establishing connection with server
let socket = io.connect(`http://localhost:${PORT_NUM}`);

//Getting dom elements
const sendButton = document.getElementById('send-button');
const textBar = document.getElementById('text-bar');
const userNameBar = document.getElementById('username-input-bar');
const chatOutputDiv = document.getElementById('chat-output');

sendButton.addEventListener('click', () => {
    let textToSend = textBar.value;
    let senderName = userNameBar.value;

    //Some basic input validation
    if(textToSend == "") return;
    else if(senderName == "") {
        alert('Please enter your username!');
        return;
    }

    //Emitting message and sender name to the server
    socket.emit('messageSent', {
        senderName: senderName,
        message: textToSend
    });

});

socket.on('displayMessage', (data) => {
    let message = data.message;
    let senderName = data.senderName;
    let senderSocketID = data.senderSocketID;
    chatOutputDiv.innerHTML += `<p>${senderName}: ${message}</p>`;
});