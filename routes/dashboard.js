const express = require("express");
const router = express.Router();
const UsersSchema = require("./../schema/users_schema");

router.get("/", async (req, res) => {
  try {
    const users = await UsersSchema.find({
      _id: "6493b88bd32f566292bfe734"
    });
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
