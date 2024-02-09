const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../files/evenit.json");

router.post("/event", async (req, res) => {
  try {
    // Save all evenit data to database
    const { evenit } = req.body;

    // Save event in JSON file
    const fileData = JSON.stringify(evenit);
    fs.writeFileSync(filePath, fileData);

    // Return success
    return res.status(200).json({ msg: "File saved successfully" });
  } catch (error) {
    // Return error if an exception occurs
    console.error("Error saving file:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//Create Checkout session
router.post("/get-link", async (req, res) => {
  const { name, description, price } = req.body;

  try {
    //Check require fields
    if (!name || !description || !price) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    //Check valid price
    if (price <= 0) {
      return res.status(400).json({ msg: "Please enter a valid price" });
    }

    //Check print is integer
    if (!Number.isInteger(price)) {
      return res.status(400).json({ msg: "Please enter a valid price" });
    }

    const product = await stripe.products.create({
      name: name,
      description: description,
    });

    const amount = price * 100;

    const stripePrice = await stripe.prices.create({
      currency: "inr",
      product: product.id,
      unit_amount: amount,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success", //`${process.env.CLIENT_URL}/success
      cancel_url: "http://localhost:3000/cancel", //`${process.env.CLIENT_URL}/cancel
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { amount, id } = req.body;
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Daucu",
      payment_method: id,
      confirm: true,
    });
    console.log("Payment", payment);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});

module.exports = router;
