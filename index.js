var express = require("express");
var app = express();
var server = require("http").Server(app);
var socketIo = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 3005;
var io = socketIo(server, {
  cors: {
    origin: process.env.URL, // Replace with your client's URL
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
app.use(cors());

let Users = [];

io.on("connection", (socket) => {
  console.log("got a connection");

  socket.on("join", (props) => {
    console.log("Joining " + props.username);
    const existingUserIndex = Users.findIndex(
      (user) => user.username === props.username
    );

    if (existingUserIndex !== -1) {
      // If user already exists, update the socket
      console.log("User is already in the system");
      Users[existingUserIndex].socket = socket;
    } else {
      // If user doesn't exist, push a new entry
      console.log("User is new to the system");

      Users.push({ username: props.username, socket: socket });
    }

  });

  socket.on("notification", (props) => {
    console.log(`Notification ==> ${JSON.stringify(props)}`);
    const user = Users.find(({ username }) => username == props.to_user);

    if (user) {
      console.log("Sending Notification to " + user.username);
      user.socket.emit("notification", props.data);
      console.log(Users);
    }
  });
});
