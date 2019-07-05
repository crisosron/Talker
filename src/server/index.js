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

//Connection handling
io.on('connect', (clientSocket) => {
    console.log(`Connection with client established: ${clientSocket.id}`);

    //Client disconnection handling
    clientSocket.on('disconnect', () => {
        console.log('Connection with client lost');
    });

});