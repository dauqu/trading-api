const express = require("express");
const router = express.Router();
const TransactionSchema = require("../schema/transaction_schema");

// get all transactions
router.get("/", async (req, res) => {
  //get all transactions
  try {
    const transaction = await TransactionSchema.find();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//   add new transaction
router.post("/", async (req, res) => {
  const transaction = new TransactionSchema({
    user_id: req.body.user_id,
    amount: req.body.amount,
    status: req.body.status,
    type: req.body.type,
    description: req.body.description,
    date: req.body.date,
    amount: req.body.amount,
    source: req.body.source,
    destination: req.body.destination,
    result: req.body.result,
    error: req.body.error,
    approval: req.body.approval,
    transaction_id: req.body.transaction_id,
    date: req.body.date,
    status: req.body.status,
    type: req.body.type,
    description: req.body.description,
  });
  try {
    transaction.save();
    return res.status(201).json({
      message: "transaction saved",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// update transaction status
router.put("/:id", async (req, res) => {
  try {
    const transaction = await TransactionSchema.findById(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found", status: "error" });
    }
    transaction.status = req.body.status;
    transaction.save();
    res
      .status(200)
      .json({ message: "Transaction updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
