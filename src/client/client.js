//Establishing connection with server
let socket = io.connect(`http://localhost:${PORT_NUM}`);

//Getting dom elements
const sendButton = document.getElementById('send-button');
const textBar = document.getElementById('text-bar');
const userNameBar = document.getElementById('username-input-bar');
const chatOutputDiv = document.getElementById('chat-output');
const confirmNameButton = document.getElementById('confirm-name-button');
const usersBar = document.getElementById('users-bar');

confirmNameButton.addEventListener('click', () => {
    let userName = userNameBar.value;
    if(userName == "") alert("Enter a valid username!");
    else socket.emit('registerUserName', {userName: userName});
});

//Handles events where Enter key is pressed
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        
        // Determines which of the 2 input bars are active
        if(document.activeElement === userNameBar) confirmNameButton.click();
        else if(document.activeElement === textBar) sendButton.click();
    }
});

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

    textBar.value = "";

});

socket.on('userNameRegisteredStatus', (data) => {
    let validUserName = data.validUserName;
    if(validUserName) {
        alert(`Username registered as: ${userNameBar.value}`);
        createUserBarItem(userNameBar.value);
    }
    else alert(`Duplicate username, please enter a different username`);
});


socket.on('displayMessage', (data) => {
    let message = data.message;
    let senderName = data.senderName;
    let senderSocketID = data.senderSocketID;

    //Highlights the username in blue if the message being displayed is from this client, else highlight the username red
    if(senderSocketID == socket.id)chatOutputDiv.innerHTML += `<p><strong class="this-sender">${senderName}</strong>: ${message}</p><br>`;
    else chatOutputDiv.innerHTML += `<p><strong class="other-sender">${senderName}</strong>: ${message}</p><br>`;
});

/**
* Creates a user bar item object
*
*/
function createUserBarItem(userName){
    usersBar.innerHTML += `<div class="user-bar-item this-sender">
                              <p>${userName}</p>        
                           </div>`
    console.log(`Created a user bar for the user name: ${userName}`);
}
