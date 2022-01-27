const router = require("express").Router();
const category = require("../models/category");

//create
router.post("/", async (req, res) => {
  const newcat = new category(req.body);
  try {
    const savedcat = await newcat.save();
    res.status(200).json(savedcat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all category
router.get("/", async (req, res) => {
  try {
    const cat = await category.find();
    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
