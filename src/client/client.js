//Establishing connection with server
let socket = io.connect(`http://localhost:${PORT_NUM}`);

//Getting dom elements
const sendButton = document.getElementById('send-button');
const textBar = document.getElementById('text-bar');
const userNameBar = document.getElementById('username-input-bar');
const chatOutputDiv = document.getElementById('chat-output');
const confirmNameButton = document.getElementById('confirm-name-button');
const usersBar = document.getElementById('users-bar');

confirmNameButton.addEventListener('click', confirmUserName);
sendButton.addEventListener('click', sendMessage);

//Handles events where Enter key is pressed
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        
        // Determines which of the 2 input bars are active
        if(document.activeElement === userNameBar) confirmNameButton.click();
        else if(document.activeElement === textBar) sendButton.click();
    }
});

//Server confirms name validity of this client
socket.on('userNameRegisteredStatus', (data) => {
    userNameRegisteredStatus(data);
});

//Handling for when the server requests for all clients to create a new user bar item
socket.on('createUserBarItem', (data) => {
    let userName = data.userName;
    createUserBarItem(userName);
});


socket.on('displayMessage', (data) => {
    displayMessage(data);
});

/**
 * Creates a user bar item object
 * @param {string} userName Username of the client associted with the user bar item to be created
 */
function createUserBarItem(userName){
    usersBar.innerHTML += `<div class="user-bar-item this-sender" id="${userName}">
                              <p>${userName}</p>        
                           </div>`;
    const userBarDiv = document.getElementById(userName);
    let userBarItem = new UserBarItem(userName, userBarDiv, socket.id);
    userBarItems.push(userBarItem);
    console.log(`Created a user bar for the user name: ${userName}`);  
}

/**
 * Sends a message to all clients
 */
function sendMessage(){
    console.log('sendMessage function called');
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
}

/**
 * Emits a message to the server to register the user name of this client
 */
function confirmUserName(){
    let userName = userNameBar.value;
    if(userName == "") alert("Enter a valid username!");
    else socket.emit('registerUserName', {userName: userName});
}

/**
 * Checks if the user name has been successfully registered by the server
 * @param {Object} data Object that contains a boolean value that indicates if the user name is valid
 */
function userNameRegisteredStatus(data){
    let validUserName = data.validUserName;
    if(validUserName) {
        alert(`Username registered as: ${userNameBar.value}`);
        socket.emit('createUserBarItem', {
            userName: userNameBar.value
        });
    }
    else alert(`Duplicate username, please enter a different username`);
}

/**
 * Displays the message sent from a client to this clients viewport
 * @param {Object} data Object that holds information about the message being sent
 */
function displayMessage(data){
    let message = data.message;
    let senderName = data.senderName;
    let senderSocketID = data.senderSocketID;

    //Highlights the username in blue if the message being displayed is from this client, else highlight the username red
    if(senderSocketID == socket.id)chatOutputDiv.innerHTML += `<p><strong class="this-sender">${senderName}</strong>: ${message}</p><br>`;
    else chatOutputDiv.innerHTML += `<p><strong class="other-sender">${senderName}</strong>: ${message}</p><br>`;
}