const mongoose = require("mongoose");

//Schema
const TransactionSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    amount: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      required: true,
    },

    error: {
      type: String,
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },

    approval: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("trx", TransactionSchema);
