const router = require("express").Router();
const User = require("../models/user");
const book = require("../models/book");

//Create a new book
router.post("/", async (req, res) => {
  const newbook = new book(req.body);
  try {
    const savedBook = await newbook.save();
    res.status(200).json(savedBook);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update book
router.put("/:id", async (req, res) => {
  try {
    const Book = await book.findById(req.params.id);
    if (Book.username === req.body.username) {
      try {
        const updatebook = await book.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatebook);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(404).json("You can update only your book ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete book
router.delete("/:id", async (req, res) => {
  try {
    const Book = await book.findById(req.params.id);
    if (Book.username === req.body.username) {
      try {
        await Book.delete();
        res.status(200).json("Book has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(404).json("You can delete only your book ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get book
router.get("/:id", async (req, res) => {
  try {
    const Book = await book.findById(req.params.id);
    res.status(200).json(Book);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all Book
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catname = req.query.cat;
  // const limit = (req.query.limit)*1;// for converting into int
  // const page = req.query.page*1;
  let limit = 10;
  let page = 1;
  if (req.query.limit) {
    limit = req.query.limit * 1;
  }
  if (req.query.page) {
    page = req.query.page * 1;
  }
  try {
    let Book;
    if (username) {
      Book = await book
        .find({ username })
        .skip((page - 1) * limit)
        .limit(limit); //pagenation
    } else if (catname) {
      Book = await book
        .find({
          categories: {
            $in: [catname],
          },
        })
        .skip((page - 1) * limit)
        .limit(limit);
    }
    // if no category and username given,return all book
    else {
      Book = await book
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
    }
    res.status(200).json(Book);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
