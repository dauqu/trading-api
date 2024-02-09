const mongoose = require("mongoose");

//Schema
const RoomSchema = new mongoose.Schema(
  {
    participients: {
      type: Array,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("room", RoomSchema);  
