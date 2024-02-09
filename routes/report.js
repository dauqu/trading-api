const express = require("express");
const router = express.Router();
const ReportSchema = require("../schema/report_schema");
const CheckAuth = require("./../functions/check_auth");
const NewsSchema = require("../schema/news_schema");
const UsersSchema = require("./../schema/users_schema");

//Get all notifications
router.get("/", async (req, res) => {
  try {
    const report = await ReportSchema.find().lean();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Add bookmark
router.post("/", async (req, res) => {
  //Check all field
  // Check all fields
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.news_id ||
    !req.body.user_id
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", status: "error" });
  }

  // Check auth
  const check = await CheckAuth(req, res);
  if (check.auth === false) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null, auth: false });
  }

  //Check if news id is valid
  const news = await NewsSchema.findById(req.body.news_id).lean();
  if (!news) {
    return res.status(404).json({ message: "News not found", status: "error" });
  }

  //Check if user id is valid
  const user = await UsersSchema.findById(req.body.user_id).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found", status: "error" });
  }

  const report = new ReportSchema({
    title: req.body.title,
    description: req.body.description,
    news_id: req.body.news_id,
    user_id: check.auth._id,
  });
  try {
    report.save();
    res.status(201).json({
      message: "Reported",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Delete bookmark
router.delete("/:id", (req, res) => {
  ReportSchema.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "Report Deleted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

module.exports = router;
