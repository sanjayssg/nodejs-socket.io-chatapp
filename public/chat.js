//make connection
var socket = io.connect("http://localhost:3002");

//query dom
var message = document.getElementById("message"),
    // handle = document.getElementById("handle"),
    btn = document.getElementById("send"),
    output = document.getElementById("output");
    feedback = document.getElementById("feedback");
    broadcast = document.getElementById("broadcast");
    users = document.getElementById("users");

// event listener
btn.addEventListener("click", function(){
    socket.emit("chat", {
        "message": message.value,
    });
    message.value = "";
});
message.addEventListener("keypress", function(){
    socket.emit("typing", getUserName());
});

socket.on('hello', function (data) {
    console.log(data.userName);
    sessionStorage.setItem("userName", data.userName);
});

// listen to socket events

socket.on('listing', function (data) {
    let allUsers = data.users; 
    console.log(data.users)
    users.innerHTML = "<p>All users: " + allUsers + "</p>";
    broadcast.innerHTML = "<h3> " + data.userName +" </h3> <p><strong> " + data.users.length + " users online </strong>";
 });

socket.on("chat", function(data){
    console.log(JSON.stringify(data))
    feedback.innerHTML = "";
    output.innerHTML += "<p><strong>" + data.userName + ":</strong> "+ data.message + "</p>";
})

socket.on("typing", function(data){
    feedback.innerHTML = "<p><em>" + data + "is typing a msg</em></p>";
})

socket.on("disconnect", function(data){
    output.innerHTML += "<p><strong>" + data.userName + ":</strong> is disconnected " + now() + "</p>";
});

function getUserName(){
    return sessionStorage.getItem("userName");
}

function now(){
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    return datetime;
}