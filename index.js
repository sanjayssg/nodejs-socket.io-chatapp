var express = require("express");
var socket = require("socket.io");

// app setup
var app = express();

var server = app.listen(3002, function(){
    console.log("Server is running on the port- 3002")
})

//static files
app.use(express.static("public"));

// socket setup
var io = socket(server);

var users = {};
var users_no = 1;

function getUsers () {
    var userNames = [];
    for(var name in users) {
        // console.log(name)
      if(users[name]) {
        userNames.push(name);
        // userNames[name]
      }
    }
    return userNames;
}

io.on("connection", function(socket){
    var userNumber = users_no++;
    var userName = 'user-' + userNumber;
    users[userName] = socket;
    // console.log(users[userName])
    console.log("connection made with socket id - ", socket.id);

    io.sockets.emit('listing', {
        "users": getUsers(),
        "userName": userName
    });
    
    // io.sockets.emit("connect", socket.id);
    socket.emit('hello', { userName: userName });

    socket.on('chat', function (data) {
        console.log(data.message)
        io.sockets.emit('chat', {
            "userName": userName,
            "message": data.message
        });
    });

    // socket.on('message', function (data) {
    //     users[data.user].emit('message', userName + '-> ' + data.message); 
    // });

    socket.on("typing", function(data){
        socket.broadcast.emit("typing", userName);
    });

    socket.on("disconnect", function(){
        users[userName] = null;
        io.sockets.emit('listing', getUsers());
        io.sockets.emit("disconnect", {
            "userName": userName
        });
    });
});