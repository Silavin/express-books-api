const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const asyncWrapper = require("../util/asyncWrapper");

/* GET home page. */
router.get(
  "/",
  asyncWrapper(async (req, res, next) => {
    res.status(200).json({ message: "Hello express-books-api" });
  })
);

const db = mongoose.connection;

db.on("error", error => {
  console.error("An error has occured", error);
});

db.once("open", () => {
  console.log("datbase has been connected");
});

module.exports = router;
