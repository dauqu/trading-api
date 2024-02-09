const mongoose = require("mongoose");

//Schema
const ChatSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    sender_id: {
      type: String,
      required: true,
    },
    room_id: {
      type: String,
      required: true,
    },
    attachment: {
        type: String,
        default: null,
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chat", ChatSchema);
