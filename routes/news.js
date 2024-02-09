const express = require("express");
const router = express.Router();
const NewsSchema = require("../schema/news_schema");
const slugify = require("slugify");
require("dotenv").config();
const fs = require("fs");
const CheckAuth = require("./../functions/check_auth");

//Get all news
router.get("/page/:page", async (req, res) => {
  if (isNaN(req.params.page)) {
    return res.status(400).json({ message: "Invalid page number" });
  }
  const page = req.params.page;
  //Each page will have 10 news
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    //Get all news with publisher name
    const news = await NewsSchema.find({ published: true })
      .populate("publisher", "name")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "publisher",
        select: "-password -email -phone -role -rpt",
      });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Trandings news
router.get("/tranding/:page", async (req, res) => {
  //Check if page is not a number
  if (isNaN(req.params.page)) {
    return res.status(400).json({ message: "Invalid page number" });
  }
  const page = req.params.page;
  //Each page will have 10 news
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    const currentDate = new Date();
    const pastDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // subtract 24 hours from the current date

    const news = await NewsSchema.find({
      published: true,
      date: { $gte: pastDate },
    })
      .populate("publisher", "name")
      .sort({ views: -1 }) // sort by most views
      .skip(skip)
      .limit(limit)
      .populate({
        path: "publisher",
        select: "-password -email -phone -role -rpt",
      });

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/latest/:page", async (req, res) => {
  const page = parseInt(req.params.page);

  if (isNaN(page) || page < 1) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  const limit = 10;
  const skip = (page - 1) * limit;
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const news = await NewsSchema.find({
      published: true,
      createat: { $gte: pastDate },
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("publisher", "-password -email -phone -role -rpt");

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all news
router.get("/", async (req, res) => {
  //Get all latest news 50 news
  try {
    const news = await NewsSchema.find().sort({ _id: -1 }).limit(100).populate({
      path: "publisher",
      select: "-password -email -phone -role -language -rpt",
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const news = await NewsSchema.findById(req.params.id).populate({
      path: "publisher",
      select: "-password -email -phone -role -rpt",
    });

    if (!news) {
      return res
        .status(404)
        .json({ message: "News not found", status: "error" });
    }

    // Add a description field if it does not exist
    if (!news.description) {
      news.description = "This news article does not have a description.";
    }

    //Add views if it does not exist
    if (!news.views) {
      news.views = 0;
    }

    // Increment the view count by 1
    news.views += 1;
    await news.save();

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get news by category
router.get("/category/:category/:page", async (req, res) => {
  //Get param from url
  const category = req.params.category;
  const page = req.params.page;

  //If page is not number
  if (isNaN(req.params.page)) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  //find news by category
  try {
    //Get new by category and each  page will have 10 news
    const limit = 10;
    const skip = (page - 1) * limit;

    const news = await NewsSchema.find({ category: category, published: true }) // find news by category
      .sort({ date: -1 }) // sort by most recent
      .skip(skip)
      .limit(limit)
      //Remove title and description from news
      .select("-articles -is_published -keywords -tags -publisher");
    // .populate({
    //   path: "publisher",
    //   select: "-password -email -phone -role -rpt", 
    // });

    res.status(200).json(news);
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
      .json({ message: "Only Admin Can Publish News", auth: false });
  }

  //Check file is exist
  if (!req.files) {
    return res.status(400).json({ message: "Image is required" });
  }

  //Create folder in file by date
  const date = new Date();
  const name =
    date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

  const folderName = "./files/" + name + "/";

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  //Rename image
  const image = req.files.image;

  //Rename file with slug
  const file_slug = slugify(image.name, {
    replacement: "-",
    remove: /[*+~_()'"!:@]/g,
    lower: true,
  });

  //Move file to folder
  image.mv(folderName + file_slug, (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  //Create Slug with filter to remove special characters
  const slug = slugify(req.body.title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });

  // Check if slug already exists
  const existingNews = await NewsSchema.findOne({ slug });

  if (existingNews) {
    return res.status(400).json({ message: "Slug already exists" });
  }

  // const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  const news = new NewsSchema({
    title: req.body.title,
    articles: req.body.articles,
    keywords: req.body.keywords,
    tags: req.body.tags,
    description: req.body.description,
    slug: slug,
    image: name + "/" + file_slug,
    category: req.body.category,
    publisher: check.data._id,
    read_more: req.body.read_more,
    is_published: false,
  });
  try {
    await news.save();
    res
      .status(201)
      .json({ message: "News created successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Update One
router.patch("/:id", async (req, res) => {
  try {
    const news = await NewsSchema.findById(req.params.id);

    if (!news) {
      return res
        .status(404)
        .json({ message: "News not found", status: "error" });
    }

    news.title = req.body.title;
    news.description = req.body.description;
    news.image = req.body.image;
    await news.save();
    res
      .status(200)
      .json({ message: "News updated successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete One
router.delete("/:id", async (req, res) => {
  try {
    const news = await NewsSchema.findById(req.params.id);
    if (!news) {
      return res
        .status(404)
        .json({ message: "News not found", status: "error" });
    }

    await news.remove();
    res
      .status(200)
      .json({ message: "News deleted successfully", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
