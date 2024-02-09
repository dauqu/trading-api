const express = require("express");
const router = express.Router();
const socket = require("socket.io");

const ChatSchema = require("../../schema/chat_shcema");
const CheckAuth = require("../../functions/check_auth");

module.exports = function (io) {
  // get all chats
  router.get("/", async (req, res) => {
    try {
      const chat = await ChatSchema.find();
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve chat" });
    }
  });

  //Get Chat by Room
  // get all chats
  router.get("/room/:room", async (req, res) => {
    const room = req.params.room;
    try {
      const chat = await ChatSchema.find({
        room_id: room,
      });

      //Broadcost message to everyone on this room
      io.to(room).emit("new_message", room);

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve chat" });
    }
  });

  // Outside of the router
  io.on("connection", (socket) => {
    console.log("User connected to socket:", socket.id);

    socket.on("join", (room) => {
      socket.join(room);
      console.log("User joined room:", room);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  //add new chat
  router.post("/", async (req, res) => {
    // Check Login
    const check = await CheckAuth(req, res);

    if (check.auth === false) {
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, auth: false });
    }

    //Check all fields are filled
    if (!req.body.content) {
      return res.status(400).json({ message: "Content is required" });
    }

    //Check room is available
    if (!req.body.room_id) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const chat = new ChatSchema({
      content: req.body.content,
      sender_id: check.data._id.toString(),
      room_id: req.body.room_id,
      attachment: req.body.attachment,
    });

    try {
      const newChat = await chat.save();

      io.to(newChat.room_id).emit("new_message", newChat);

      res.status(201).json(newChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete chat
  router.delete("/:id", async (req, res) => {
    try {
      const chat = await ChatSchema.findById(req.params.id);
      if (!chat) {
        return res
          .status(404)
          .json({ message: "Chat not found", status: "error" });
      }

      await chat.remove();
      res
        .status(200)
        .json({ message: "Chat deleted successfully", status: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
