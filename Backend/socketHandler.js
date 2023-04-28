const jwt = require("jsonwebtoken");
const http = require("http");
const socketIO = require("socket.io");
const socketioAuth = require("socketio-auth");

const SECRET_KEY = "jkjhlhljjjijoi";
const authenticate = async (socket, data, callback) => {
  const { token } = data;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    socket.decoded = decoded;
    callback(null, true);
  } catch (err) {
    callback(err);
  }
};

module.exports = (app) => {
  const server = http.createServer(app);
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  socketioAuth(io, {
    authenticate,
    postAuthenticate: (socket) => {
      console.log("A user connected");

      socket.on("createRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User created and joined room ${roomId}`);
      });

      socket.on("joinRoom", (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);

        if (room && room.size < 2) {
          socket.join(roomId);
          console.log(`User joined room ${roomId}`);
          socket.emit("assignTeam", role === "HostPlayer" ? TeamType.NOUS : TeamType.ADVERSAIRE);
          io.to(roomId).emit("startGame");
        } else {
          console.log(`Failed to join room ${roomId}`);
        }
      });

      socket.on("move", ({ roomId, from, to }) => {
        socket.to(roomId).emit("move", { from, to });
      });
    },
    disconnect: (socket) => {
      console.log("A user disconnected");
    },
  });

  return server;
};
