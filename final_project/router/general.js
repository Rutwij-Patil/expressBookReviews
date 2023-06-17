const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const user = req.body.user;
  let userName = user.userName;
  let password = user.password;
  if (!userName || !password) {
    res.status(400).send("userName or password not provided");
  }
  let existingUsers = users.filter((values) => {
    return values.userName == userName;
  });
  if (existingUsers.length > 0) {
    res.status(500).send("user already exists");
  } 
  else {
    users.push({ userName, password });

    res.send("successfully registered");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  res.send(filtered_book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const asArray = Object.entries(books);
  const filtered = asArray.filter(([key, value]) => value.author === author);
  const resp = Object.fromEntries(filtered);
  res.send(resp);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const asArray = Object.entries(books);
  const filtered = asArray.filter(([key, value]) => value.title === title);
  const resp = Object.fromEntries(filtered);
  res.send(resp);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  res.send(filtered_book.reviews);
});
public_users.get('/promise', (req,res) => {
  const prom = new Promise((resolve, reject) => {
      axios.get('localhost:5500/')
      .then(response => {
          resolve(response.data);
      }).catch( err => {
          reject(err);
      });
  });
  prom.then(data => {
      res.send(JSON.stringify(books,null,4));
  }).catch(err =>{
      res.send(err);
  })
});

public_users.get('/promise/isbn/:isbn', (req,res) => {
  const isbn = req.params.isbn;
  const prom = new Promise((resolve, reject) => {
      axios.get(`localhost:5500/isbn/${isbn}`)
      .then(response => {
          resolve(response.data);
      }).catch( err => {
          reject(err);
      });
  });
  prom.then(data => {
      res.send(data);
  }).catch(err =>{
      res.send(err);
  })
});

public_users.get('/promise/author/:author', (req,res) => {
  const author = req.params.author;
  const prom = new Promise((resolve, reject) => {
      axios.get(`localhost:5500/author/${author}`)
      .then(response => {
          resolve(response.data);
      }).catch( err => {
          reject(err);
      });
  });
  prom.then(data => {
      res.send(data);
  }).catch(err =>{
      res.send(err);
  })
});

public_users.get('/promise/title/:title', (req,res) => {
  const title = req.params.title;
  const prom = new Promise((resolve, reject) => {
      axios.get(`localhost:5500/title/${title}`)
      .then(response => {
          resolve(response.data);
      }).catch( err => {
          reject(err);
      });
  });
  prom.then(data => {
      res.send(data);
  }).catch(err =>{
      res.send(err);
  })
});

module.exports.general = public_users;
