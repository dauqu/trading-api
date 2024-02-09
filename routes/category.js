const express = require("express");
const router = express.Router();
const CategoriesSchema = require("../schema/categories_schema");
const Slugyfy = require("slugify");
const CheckAuth = require("../functions/check_auth");

//Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await CategoriesSchema.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one category
router.get("/:id", async (req, res) => {
  try {
    const category = await CategoriesSchema.findById(req.params.id).lean();
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Create One
router.post("/", async (req, res) => {
  const check = await CheckAuth(req, res);

  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  //Check if user is admin
  if (check.data.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized, only admin can create category" });
  }

  //Create slug with remove spaces and lowercase
  const slug = Slugyfy(req.body.name, {
    lower: true,
    remove: /[*+~.()'"!:@_]/g,
  });

  const category = new CategoriesSchema({
    name: req.body.name,
    slug: slug,
    description: req.body.description,
    image: req.body.image,
    publisher: "harsha web",
  });
  try {
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Update One
router.patch("/:id", async (req, res) => {
  const check = await CheckAuth(req, res);

  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  //Check if user is admin
  if (check.data.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized, only admin can create category" });
  }

  try {
    const category = await CategoriesSchema.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }

    category.name = req.body.name;
    category.description = req.body.description;
    category.image = req.body.image;
    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete One
router.delete("/:id", async (req, res) => {
  const check = await CheckAuth(req, res);

  if (check.auth === false) {
    return res.status(401).json({ message: "Unauthorized", auth: false });
  }

  //Check if user is admin
  if (check.data.role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized, only admin can create category" });
  }

  try {
    const category = await CategoriesSchema.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", status: "error" });
    }
    await category.remove();
    res
      .status(200)
      .json({ message: "Category deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
