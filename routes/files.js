const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const serviceAccount = require("./../config/fir-344db-firebase-adminsdk-boafr-553bead95a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://fir-344db.appspot.com",
});

const bucket = admin.storage().bucket();

// Get all files
router.get("/", async (req, res) => {
  try {
    // Get files from firebase storage
    const [files] = await bucket.getFiles();
    const fileNames = files.map((file) => {
      return file.name;
    });
    res.status(200).json(fileNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create One
router.post("/", async (req, res) => {
  try {
    //Check file is present
    if (!req.files) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files;
    const destination = req.body.destination;

    //Upload file to firebase stoorage
    // Upload the file to Firebase Storage
    bucket
      .upload(file, {
        destination: destination,
        // You can also set metadata for the file if needed
        metadata: {
          contentType: "text/plain", // Replace with the correct content type
        },
      })
      .then(() => {
        console.log("File uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
