const express = require("express");
const router = express.Router();
const UsersSchema = require("./../schema/users_schema");

// get all users 
router.get("/", async (req, res) => {
    try {
        const users = await UsersSchema.find().lean();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get data looking for 
router.get("/looking/:name", async (req, res) => {
    //    return params
    const lookingFor = req.params["name"];
    try {
        const users = await UsersSchema.find({ looking_for: lookingFor }).lean();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});








module.exports = router;