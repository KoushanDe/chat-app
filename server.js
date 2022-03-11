const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {  cors: {
  origin: "*",
  //allowedHeaders: ["my-custom-header"],
  methods: ["GET", "POST"],
}
});
const PORT = 5000;

// app.get('/', (req,res) => {
//     res.status(200).json({name: "server"});
// })

const users = {};

//Listens to all the connection which connects
io.on("connection", (socket) => {
  console.log("Someone connected and socket id: "+ socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnceted.`);

    for(let user in users){
      if(users[user] == socket.id){
        delete users[user];
      }
    }
    io.emit("all_users", users);
  });

  socket.on("new_user", (username)=>{
    console.log("server: "+username);
    users[username] = socket.id;

    //we can tell every other user someone connected

    io.emit("all_users", users); 
  });

  socket.on("send_message", (data)=>{
    // console.log(data);

    const socketId = users[data.receiver];

    io.to(socketId).emit("new_message", data);
  });
});



httpServer.listen(PORT,()=>{
    console.log(`Server listening to port ${PORT}`);
});