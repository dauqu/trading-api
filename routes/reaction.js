const express = require("express");
const router = express.Router();
const ReactionSchema = require("../schema/reaction_schema");
const CheckAuth = require("./../functions/check_auth");

router.get("/", async (req, res) => {
  //get all reaction
  try {
    const reaction = await ReactionSchema.find();
    res.status(200).json(reaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/mine", async (req, res) => {
  // Check Login
  const check = await CheckAuth(req, res);
  //Get data by random_user_id where like
  try {
    const reaction = await ReactionSchema.find({
      random_user_id: check.data._id.toString(),
      reaction_type: "like",
    }).populate({
      path: "user_id",
      select: "name email dp full_name",
    });
    res.status(200).json(reaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create
router.post("/", async (req, res) => {
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  const reaction = new ReactionSchema({
    user_id: check.data._id,
    random_user_id: req.body.random_user_id,
    reaction_type: req.body.reaction_type,
  });
  try {
    reaction.save();
    return res.status(201).json({
      message: "reaction saved",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//update
router.patch("/", async (req, res) => {});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const reaction = await ReactionSchema.findById(req.params.id);
    if (!reaction) {
      return res
        .status(404)
        .json({ message: "Reaction Is Not Found", status: "error" });
    }

    await ReactionSchema.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "Reaction deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
