const express = require("express");
const router = express.Router();
const asyncWrapper = require("../util/asyncWrapper");
const Author = require("../model/author");

// cannot user write here. write can only use with .end()

router.get(
  "/",
  asyncWrapper(async (req, res, next) => {
    const listOfAuthors = await Author.find();
    res.status(200).json(listOfAuthors);
  })
);

router.get(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    const ID = req.params.id;
    const selectedAuthor = await Author.findById(ID);
    res.status(200).json(selectedAuthor);
  })
);

router.post(
  "/",
  asyncWrapper(async (req, res, next) => {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  })
);

router.put(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    const changedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      ...changedAuthor.toJSON(),
      message: "Updated succesfully"
    });
  })
);

router.delete(
  "/:id",
  asyncWrapper(async (req, res, next) => {
    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "The author's profile has been deleted" });
  })
);

module.exports = router;
