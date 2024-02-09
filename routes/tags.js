const express = require("express");
const router = express.Router();
const CategoriesSchema = require("../schema/categories_schema");
const Slugyfy = require("slugify");
const CheckAuth = require("../functions/check_auth");

module.exports = router;