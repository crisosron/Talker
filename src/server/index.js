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

    clientSocket.on('registerUserName', (data) => {
        let userName = data.userName;

        //Sends message to specific client if the client tries to register a user name that is already in use
        if(userNames.includes(userName))clientSocket.emit('userNameRegisteredStatus', {validUserName: false});
        else {
            clientSocket.emit('userNameRegisteredStatus', {validUserName: true});
            userNames.push(userName);    
        }
    });

    clientSocket.on('messageSent', (data) => {
        console.log(`a message was sent from a client`);

        //Emitting to all clients connected to this server to display a message sent by a client
        io.sockets.emit('displayMessage', {
            message: data.message,
            senderName: data.senderName,
            senderSocketID: clientSocket.id //To identify who sent the message
        });

    });

    //Client disconnection handling
    clientSocket.on('disconnect', () => {
        console.log('Connection with client lost');
    });

});
