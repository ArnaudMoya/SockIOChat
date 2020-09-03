let express = require('express');
let app = express();
let server = require('http').createServer(app)
let io = require('socket.io').listen(server);


users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Serveur running...')

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html')
})

io.sockets.on('connection', function (socket) {
    console.log("here")
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length)

    socket.on('disconnect',function (data) {
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1)
        updateUsernames();
        //deconnexion
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    })

    //send message
    socket.on('send message',function (data) {
        console.log(data);
        io.sockets.emit('new message',{msg: data, user: socket.username})
    })

    //New User
    socket.on('new user',function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames() {
        io.sockets.emit('get users', users)

    }

});
