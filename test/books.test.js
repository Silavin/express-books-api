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

let listOfBooks = {};

async function addFakeBooks() {
  const author1 = new Author({
    name: "Kim",
    email: "sil@s.com",
    password: "dob"
  });

  const author2 = new Author({
    name: "Net",
    email: "Demain",
    password: "adsad"
  });

  const savedAuthor1 = await author1.save();
  const savedAuthor2 = await author2.save();

  const book1 = new Book({
    title: "hihi",
    author: savedAuthor1._id
  });

  const book2 = new Book({
    title: "Greetings",
    author: savedAuthor2._id
  });

  const saveBook1 = await book1.save();
  const saveBook2 = await book2.save();

  listOfBooks = { book1: saveBook1, book2: saveBook2 };
}

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

  // Add fake data to the DB to be used in the test
  await addFakeBooks();
});

test("POST /books should create a new book", async () => {
  const mockBook = {
    title: "Grad",
    author: listOfBooks.book1.author
  };

  const response = await request(app)
    .post("/books")
    .send(mockBook);

  expect(response.status).toBe(201);
  expect(response.body.title).toEqual(mockBook.title);
  expect(response.body.author).toEqual(mockBook.author.toString());
});

test("PUT /books/:id should update selected book", async () => {
  const mockBook = {
    title: "Grad"
  };
  const response = await request(app)
    .put(`/books/${listOfBooks.book1._id}`)
    .send(mockBook);
  console.log(listOfBooks);
  console.log(response.body);

  expect(response.status).toBe(200);
  expect(response.body.title).toEqual(mockBook.title);
});

test("DELETE /books/:id should delete selected book", async () => {
  const response = await request(app).delete(
    `/books/${listOfBooks.book2.author}`
  );

  expect(response.status).toBe(200);
  expect(response.body.message).toEqual("book has been deleted");
});

test("GET /books/:id should retrieve selected book", async () => {
  const response = await request(app).get(`/books/${listOfBooks.book1.id}`);

  expect(response.status).toBe(200);
  expect(response.body.title).toEqual(listOfBooks.book1.title);
});
