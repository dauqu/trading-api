const express = require("express");
const router = express.Router();
const CheckAuth = require("./../functions/check_auth");
const NotificationSchema = require("./../schema/notification_schema");

// get all notifications
router.get("/", async (req, res) => {

  try {
    const notification = await NotificationSchema.find().lean();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//my notifications
router.get("/my", async (req, res) => {
  const check = await CheckAuth(req, res);

  // get my notifications
  try {
    const notification = await NotificationSchema.find({
      user_id: check.data._id,
    }).lean();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//   add new data
router.post("/", async (req, res) => {
  const notification = new NotificationSchema({
    title: req.body.title,
    description: req.body.description,
    user_id: req.body.user_id,
    image: req.body.image,
    link: req.body.link,
  });
  try {
    notification.save();
    res.status(201).json({
      message: "data saved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// delete 

router.delete("/:id", async (req, res) => {
  try {
    const notification = await NotificationSchema.findById(req.params.id);
    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found", status: "error" });
    }
    await   NotificationSchema.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "Notification deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
