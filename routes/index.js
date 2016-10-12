var users = [];
var messages = [];


var is_user = function(user){
  var users_count = users.length;

  for(var i = 0; i< users_count; i++){
    if (user == users[i] ){
      return true;
    } else
    return false;
  }
};


module.exports = function Route(app, server){
  var io = require("socket.io").listen(server);

  io.sockets.on("connection", function(socket){
    console.log('a user connected!');
    socket.broadcast.emit('hi');

    socket.on("disconnect",function(){
      console.log('user disconnected');
    });

    socket.on("page_load", function(data){
      console.log(data);
      if (is_user(data.user) === true){
        socket.emit("existing_user", {error: "This user already exist"});
      } else {
        users.push(data.user);
        socket.emit("load_messages", {current_user: data.user, messages: messages });
      }
    });

    socket.on("message", function(data){
      console.log(data);
    });

    socket.on("chat_message", function(msg){
      console.log("message:" + msg);
      messages.push(msg);
      io.emit("load_messages",{messages: messages});
    });
  });

  app.get("/", function(req, res){
    res.render("index");
  });
};
