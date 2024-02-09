const mongoose = require("mongoose");

//Schema
const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    articles: {
      type: String,
      required: true,
    },
    keywords: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
      ref: "users",
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    read_more: {
      type: String,
    },
    language: {
      type: String,
      required: true,
      default: "en",
    },
    is_published: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("news", NewsSchema);
