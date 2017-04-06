var express = require('express')
var router = express.Router()
var Article = require('../models/Articles.js')
var Comment = require('../models/Comments.js')
var mongoose = require("mongoose")
// Snatches HTML from URLs
var request = require("request")
// Scrapes our HTML
var cheerio = require("cheerio")


router.post("/", function (req, res) {
  console.log(req.body);
  let commentBody = {
    name: req.body.name,
    comment: req.body.comment
  }
  var newComment = new Comment(commentBody);

  // Save the new book in the books collection
  newComment.save(function (err, comment) {
    // Send an error to the browser if there's something wrong
    if (err) {
      res.send(err // Otherwise...
      );
    } else {

      // REMEMBER: doc is a variable containing the document of the book we just
      // saved, so calling doc._id will grab the id of the doc, in this case, our new
      // book ALSO: We need "{new: true}" in our call, or else our query will return
      // the object as it was before it was updated
      Article.findOneAndUpdate({'url': req.body.url}, {
          $push: {
            "comments": comment._id
          }
        }, {
          new: true
        }, function (error, doc) {
          // Send any errors to the browser
          if (error) {
            res.send(error // Or send the doc to the browser
            );
          } else {
            res.json(comment);
          }
        });
    }
  });
});


module.exports = router;