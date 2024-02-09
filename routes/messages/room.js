const express = require("express");
const router = express.Router();

const RoomSchema = require("../../schema/room_schema");
const CheckAuth = require("../../functions/check_auth");

// get all rooms
router.get("/", async (req, res) => {
  // Check Login
  const check = await CheckAuth(req, res);

  try {
    //Get data and populate array
    const room = await RoomSchema.find({
      //Check participients have my ID 
      participients: { $in: [check.data._id.toString()] },
    }).populate({
      path: "participients",
      select: "name email dp full_name",
      //Remove if my id is in the array
      match: { _id: { $ne: check.data._id } },
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve room" });
  }
});

// get all rooms
router.get("/all", async (req, res) => {
  
  try {
    //Get data and populate array
    const room = await RoomSchema.find().populate({
      path: "participients",
      select: "name email dp full_name",
    })
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve room" });
  }
});

// get all rooms
router.get("/mine", async (req, res) => {
  // Check Login
  const check = await CheckAuth(req, res);
  // participants array should contain the user id h
  try {
    const room = await RoomSchema.find({
      participients: { $in: [check.data._id.toString()] },
    }).populate({
      path: "participients",
      select: "name email dp full_name",
      //Remove if my id is in the array
      match: { _id: { $ne: check.data._id } },
    });
    //return success message with status 200
    res.status(200).json({ message: "success", data: room });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve room" });
  }
});

//   add new room

router.post("/", async (req, res) => {
  // Check Login
  const check = await CheckAuth(req, res);

  //Check if participant is not empty
  if (!req.body.participant) {
    return res.status(400).json({ message: "Participant is required" });
  }

  var participants = [
    check.data._id.toString(),
    req.body.participant.toString(),
  ];

  //Check if participant is available
  const participant = await RoomSchema.findOne({
    participants: participants,
  });

  if (participant) {
    return res.status(400).json({ message: "Chat already exists" });
  }

  //Check if both participant are not same
  if (req.body.participant.toString() === check.data._id.toString()) {
    return res.status(400).json({ message: "You can't chat with yourself" });
  }

  const room = new RoomSchema({
    participients: participants,
  });

  try {
    const newRoom = await room.save();
    res.status(200).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete room

router.delete("/:id", async (req, res) => {
  try {
    const room = await ChatSchema.findById(req.params.id);
    if (!room) {
      return res
        .status(404)
        .json({ message: "Room not found", status: "error" });
    }

    await room.remove();
    res
      .status(200)
      .json({ message: "Room deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
