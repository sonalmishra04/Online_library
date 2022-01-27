const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    book: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
