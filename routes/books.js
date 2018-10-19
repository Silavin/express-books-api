const express = require("express");
const router = express.Router();
const asyncWrapper = require("../util/asyncWrapper");
const Book = require("../model/book");

/* GET books listing. */
router.get(
  "/",
  asyncWrapper(async (req, res, next) => {
    const listOfBooks = await Book.find();
    res.status(200).json(listOfBooks);
  })
);

router.get(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    const selectedBook = await Book.findById(req.params.id);

    res.status(200).json(selectedBook);
  })
);

router.post(
  "/",
  asyncWrapper(async (req, res, next) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(req.body);
  })
);

router.put(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    const updateBook = await Book.findByIdAndUpdate(req.body);
    res.status(200).json(updateBook);
  })
);

router.delete(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `delete book with id ${req.params.id}` });
  })
);

module.exports = router;
