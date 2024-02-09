const express = require("express");
const router = express.Router();
const socket = require("socket.io");

module.exports = function (io) {
  // // Handle socket connections
  io.on("connection", (socket) => {
    // Handle joining the room
    socket.on("join_room", (room) => {
      // Join the specified room
      socket.join(room);

      socket.on("send_message", (messageData) => {
        // Broadcast the message data to all connected clients in the room
        // socket.broadcast.to(room).emit("message_received", messageData);
        io.to(room).emit("message_received", messageData);
      });

      socket.on("send_audio_call", (messageData) => {
        // Broadcast the message data to all connected clients in the room
        socket.broadcast.to(room).emit("audio_call_received", messageData);
      });

      socket.on("send_video_call", (messageData) => {
        // Broadcast the message data to all connected clients in the room
        socket.broadcast.to(room).emit("video_call_received", messageData);
      });
    });
  });

  return router;
};
