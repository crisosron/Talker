let express = require('express');
let socket = require('socket.io');
let serverConstants = require('./server-constants');
let app = express();

//Server setup
let server = app.listen(serverConstants.PORT_NUM, () => {
    console.log(`Listening to requests on port num: ${serverConstants.PORT_NUM}`);
});

//Serves everything in src/client to the client side
app.use(express.static('src/client'));

//Creating server socket
let io = socket(server);

//Array of all existing usernames in the server
let userNames = [];

//Connection handling
io.on('connect', (clientSocket) => {
    console.log(`Connection with client established: ${clientSocket.id}`);

    //Handling for when a client tries to enter a user name
    clientSocket.on('registerUserName', (data) => {
        registerUserName(data, clientSocket);
    });

    //Handling for when a user bar item needs to be created
    clientSocket.on('createUserBarItem', (data) => {
        createUserBarItem(data);
    });

    //Handling for when a client sends a message
    clientSocket.on('messageSent', (data) => {
        messageSent(data, clientSocket.id);
    });

    //Client disconnection handling
    clientSocket.on('disconnect', () => {
        disconnectClient(clientSocket.id);
    });

});

/**
 * Registers the user name of the client
 * @param {Object} data Object that holds the username of the client
 */
function registerUserName(data, clientSocket){
    let userName = data.userName;

    //Sends message to specific client if the client tries to register a user name that is already in use
    if(userNames.includes(userName))clientSocket.emit('userNameRegisteredStatus', {validUserName: false});
    else {
        clientSocket.emit('userNameRegisteredStatus', {validUserName: true});
        userNames.push(userName);    
    }
}

/**
 * Sends a message to all clients to create a user bar item
 * @param {Object} data Object that holds the user name that corresponds with the UserBarItem to be created
 */
function createUserBarItem(data){
    //Emitting to all clients connected to this server to display a message sent by a client
    io.sockets.emit('createUserBarItem', {
        userName: data.userName
    });
}

/**
 * Processes the message sending across the clients
 * @param {Object} data Holds information of the sender and the message being sent
 * @param {string} clientSocketID Socket id of the sender
 */
function messageSent(data, clientSocketID){

     //Emitting to all clients connected to this server to display a message sent by a client
     io.sockets.emit('displayMessage', {
        message: data.message,
        senderName: data.senderName,
        senderSocketID: clientSocketID //To identify who sent the message
    });
}

/**
 * Operations when a client disconnects
 * @param {string} clientSocketID Socket id of the client that disconnected
 */
function disconnectClient(clientSocketID){
    console.log('Connection with client lost');
}