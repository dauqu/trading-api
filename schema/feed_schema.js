const mongoose = require("mongoose");

//Schema
const FeedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    user_id: {
      type: Users,
      required: true,
    },
   

    like: {
        type: Users,
        required: true,
      },
  

    dislike: {
        type: Users,
        required: true,
      },
  

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("feed", FeedSchema);
