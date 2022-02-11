const router = require("express").Router();
const User = require("../models/user");
const book = require("../models/book");
const Category = require("../models/category");

//Create a new book
router.post("/", async (req, res, next) => {
  console.log(req.body);
  let categories = req.body.categories;
  let catId = [];
  for (let category of categories) {
    let result = await Category.find({
      name: category,
    });
    console.log(result);
    catId.push(result[0]._id);
  }
  console.log(catId);
  req.body.categories = catId;
  const newbook = new book(req.body);
  try {
    const savedBook = await newbook.save();
    res.status(200).json(savedBook);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Get category of book---populate
router.get("/category/:name", async (req, res, next) => {
  try {
    let name = req.params.name;
    let categories = await book
      .find({
        name: name,
      })
      .populate("categories");
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update book
router.put("/:id", async (req, res, next) => {
  try {
    const Book = await book.findById(req.params.id);

    await Book.updateOne();

    res.status(200).json("updatebook");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete book
router.delete("/:id", async (req, res, next) => {
  try {
    const Book = await book.findById(req.params.id);

    await Book.delete();
    res.status(200).json("Book has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get book
router.get("/:id", async (req, res, next) => {
  try {
    const Book = await book.findById(req.params.id);
    res.status(200).json(Book);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all Book
router.get("/", async (req, res, next) => {
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
    let results = Book.slice();
    const resp_book = [];
    for (let result of results) {
      // console.log(await result.populate("categories"));
      result = await result.populate("categories");
      resp_book.push(result);
    }
    console.log(resp_book);
    results = [];
    for (let i = 0; i < resp_book.length; i++) {
      let result = {};
      result._id = resp_book[i]._id;
      result.book = resp_book[i].book;
      result.author = resp_book[i].author;
      result.username = resp_book[i].username;
      result.categories = resp_book[i].categories[0].name;
      results.push(result);
    }
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
