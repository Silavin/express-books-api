// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../model/author");
const Book = require("../model/book");

const app = require("../app");

let listOfAuthors;
let listOfBooks;

async function addFakeAuthors() {
  const author1 = new Author({
    name: "paulo",
    email: "haha@gmail.com",
    password: "123"
  });

  const detailedAuthor1 = await author1.save();

  const author2 = new Author({
    name: "john",
    email: "asdas@email.com",
    password: "2212"
  });

  const detailedAuthor2 = await author2.save();

  listOfAuthors = {
    firstAuthor: detailedAuthor1,
    secondAuthor: detailedAuthor2
  };
}

const addFakeBooks = async () => {
  const author = new Author({
    name: "Kim",
    email: "sil@s.com",
    password: "dob"
  });

  const savedAuthor = await author.save();

  const book = new Book({
    title: "hihi",
    author: `${savedAuthor._id}`
  });

  const savedBooks = await book.save();
  listOfBooks = savedBooks;
};

beforeAll(async () => {
  // Increase timeout to allow MongoDB Memory Server to be donwloaded
  // the first time
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(
    uri,
    { useNewUrlParser: true }
  );
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

beforeEach(async () => {
  // Clean DB between test runs
  mongoose.connection.db.dropDatabase();

  // Add fake data to the DB to be used in the tests
  await addFakeAuthors();
  await addFakeBooks();
});

test("GET /authors", async () => {
  const response = await request(app).get("/authors");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(3);
});

test("GET /books should display all books", async () => {
  const response = await request(app).get("/books");

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
});

test("GET /index should display welcome message", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
  expect(response.body.message).toEqual("Hello express-books-api");
});
