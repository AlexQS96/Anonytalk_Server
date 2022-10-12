const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app);
const port = process.env.PORT || 3770;
const CHAT_BOT = '';

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "https://anonytalk.netlify.app",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST"],
  },
});

//This function returns the amount of users in a specific room
function getSizeRoom(room){
  const clientsInRoom = 0;
  return io.sockets.adapter.rooms.has(room)? clientsInRoom = io.sockets.adapter.rooms.get(room).size : clientsInRoom
}

io.on("connection", (socket) => {

  //Join to Rooms
  socket.on("join_room", (data) => {

    //takes the username and room id from the login page and joins the user to the room
    const [username, roomid] = data;
    socket.join(roomid);

    //When a new user logs in the chat bot emit a message to the room about the new user
    socket.to(roomid).emit('receive_message', {
      room: roomid,
      author: CHAT_BOT,
      message: `${username} se unio al chat.`,
      time: ''
    });

    io.to(roomid).emit("room_clients", getSizeRoom(roomid));
  });

  //Send Messages
  socket.on("send_message", (data) => {
    //emit a message to the current user room
    socket.to(data.room).emit("receive_message", data);
  });

  //Leave Room
  socket.on('leave_room', (data) => {

    //When the user leaves the room the chat bot emit a message about that user
    const {username, room} = data;
    socket.leave(room);

    socket.to(room).emit('receive_message', {
      room: room,
      author: CHAT_BOT,
      message: `${username} salio del chat.`,
      time: ''
    });

    io.to(room).emit("room_clients", getSizeRoom(room));
  });

});

server.listen(port,
  console.log(`Anonytalk | Puerto : ${port}`)
);
