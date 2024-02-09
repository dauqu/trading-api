const mongoose = require("mongoose");

//Schema
const ReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    news_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("report", ReportSchema);
