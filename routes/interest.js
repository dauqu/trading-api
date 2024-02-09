const express = require("express");
const router = express.Router();
const InterestSchema = require("../schema/interest_schema");
const CheckAuth = require("../functions/check_auth");

//Get all categories
router.get("/", async (req, res) => {
  try {
    const interests = await InterestSchema.find().lean();
    res.status(200).json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create One
router.post("/", async (req, res) => {
  const check = await CheckAuth(req, res);

  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  //Check if user is admin
  if (check.data.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized, only admin can create interest" });
  }

  const interest = new InterestSchema({
    name: req.body.name,
    image: req.body.image,
  });
  try {
    await interest.save();
    res
      .status(201)
      .json({ message: "Interest created successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Delete One
router.delete("/:id", async (req, res) => {
  const check = await CheckAuth(req, res);

  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  //Check if user is admin
  if (check.data.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized, only admin can create interest" });
  }

  try {
    const category = await InterestSchema.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Interest not found", status: "error" });
    }
    await category.remove();
    res
      .status(200)
      .json({ message: "Interest deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
