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

const mockAuthor = {
  name: "paka",
  email: "ddi@mail.co",
  password: "deiljo12"
};

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

test("POST /authors should create a new author", async () => {
  const response = await request(app)
    .post("/authors")
    .send(mockAuthor);

  expect(response.status).toBe(201);
  expect(response.body.name).toEqual(mockAuthor.name);
  expect(response.body.email).toEqual(mockAuthor.email);
  expect(response.body.password).toEqual(mockAuthor.password);
});

test("PUT /authors/:id should update selected author", async () => {
  const response = await request(app)
    .put(`/authors/${listOfAuthors.firstAuthor._id}`)
    .send(mockAuthor);

  expect(response.status).toBe(200);
  expect(response.body.name).toEqual(mockAuthor.name);
  expect(response.body.email).toEqual(mockAuthor.email);
  expect(response.body.password).toEqual(mockAuthor.password);
});
test("DELETE /authors/:id should delete selected author", async () => {
  const response = await request(app).delete(
    `/authors/${listOfAuthors.secondAuthor._id}`
  );
  const response2 = await request(app).get("/authors");
  expect(response.status).toBe(200);
  expect(response2.body.length).toEqual(2);
});

test("GET /authors/:id should retrieve selected author", async () => {
  const response = await request(app).get(
    `/authors/${listOfAuthors.firstAuthor._id}`
  );

  expect(response.status).toBe(200);
  expect(response.body.name).toEqual(listOfAuthors.firstAuthor.name);
  expect(response.body.email).toEqual(listOfAuthors.firstAuthor.email);
  expect(response.body.password).toEqual(listOfAuthors.firstAuthor.password);
});
