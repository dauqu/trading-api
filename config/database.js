require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("MongoDB connection SUCCESS");
        // require('../data/import');
    } catch (error) { 
        console.error("MongoDB connection FAIL");
        // process.exit(1);
    }
};

module.exports = connectDB;