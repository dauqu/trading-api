const express = require("express");
const router = express.Router();
const MemberSchema = require("./../schema/users_schema");

// get all members
router.get("/", async (req, res) => {
  try {
    const member = await MemberSchema.find()
      .select("-password -rpt -email -phone -dial_code")
      .lean();
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve member" });
  }
});


// get member by interest
router.get("/looking/:name", async (req, res) => {
  //    return params
  const lookingFor = req.params["name"];
  try {
    const member = await MemberSchema.find({ looking_for: lookingFor })
      .select("-password -rpt -email -phone -dial_code")
      .lean();
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve member" });
  }
});

//update member
router.put("/:id", async (req, res) => {
    try {
        const member = await MemberSchema.findById(req.params.id);
        if (!member) {
            return res
                .status(404)
                .json({ message: "Member not found", status: "error" });
        }
        member.looking_for = req.body.looking_for;
        member.save();
        res
            .status(200)
            .json({ message: "Member updated successfully", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update interest
router.put("/interest/:id", async (req, res) => {
    try {
        const member = await MemberSchema.findById(req.params.id);
        if (!member) {
            return res
                .status(404)
                .json({ message: "Member not found", status: "error" });
        }
    //   update interest array
        member.interest = req.body.interest;
        member.save();
        
        res
            .status(200)
            .json({ message: "Member updated successfully", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
  res.send("Member route");
});

router.put("/:id", async (req, res) => {
  res.send("Member route");
});

module.exports = router;
