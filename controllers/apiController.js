var express = require('express')
var router = express.Router()
var Articles = require('../models/Articles.js')
var Users = require('../models/Users.js')
var mongoose = require("mongoose")
// Snatches HTML from URLs
var request = require("request")
// Scrapes our HTML
var cheerio = require("cheerio")

//this is the users_controller.js file
router.get('/', function (req, res) {
  res.render('index');
});

// Routes ====== This POST route handles the creation of a new book in our
// mongodb books collection
router.post("/submit", function (req, res) {

  var newBook = new Book(req.body);

  // Save the new book in the books collection
  newBook.save(function (err, doc) {
    // Send an error to the browser if there's something wrong
    if (err) {
      res.send(err // Otherwise...
      );
    } else {

      // REMEMBER: doc is a variable containing the document of the book we just
      // saved, so calling doc._id will grab the id of the doc, in this case, our new
      // book ALSO: We need "{new: true}" in our call, or else our query will return
      // the object as it was before it was updated
      Library
        .findOneAndUpdate({}, {
          $push: {
            "books": doc._id
          }
        }, {
          new: true
        }, function (error, doc) {
          // Send any errors to the browser
          if (error) {
            res.send(error // Or send the doc to the browser
            );
          } else {
            res.send(doc);
          }
        });
    }
  });
});

// This GET route let's us see the books we have added
router.get("/books", function (req, res) {
  // Using our Book model, "find" every book in our book db
  Book
    .find({}, function (error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error // Or send the doc to the browser
        );
      } else {
        res.send(doc);
      }
    });
});

// Route to see what our library data looks in the browser
router.get("/library", function (req, res) {
  // Find all of the entries of Library (there's only one, remember)
  Library
    .find({}, function (error, doc) {
      if (error) {
        res.send(error // Or send the doc to the browser
        );
      } else {
        res.send(doc);
      }
    });
});

// Route to see what library looks like WITH populating
router.get("/populated", function (req, res) {
  Library
    .find({})
    .populate("books")
    .exec(function (error, doc) {

      if (error) {
        res.send(error)
      } else {
        res.send(doc);
      }
    });
});

module.exports = router;
