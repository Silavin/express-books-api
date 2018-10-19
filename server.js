const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://localhost/express-book-api",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Mongodb has been connected");
  });

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}...`);
});
