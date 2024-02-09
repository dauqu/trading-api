const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      ref: "users",
    },
    random_user_id: {
      type: String,
    },
    reaction_type: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);



module.exports = mongoose.model("reaction", ReactionSchema);
