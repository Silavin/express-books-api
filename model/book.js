const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const book = Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  dataPublished: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author"
  }
});

book.plugin(uniqueValidator);

const Book = mongoose.model("Book", book);

module.exports = Book;
