var express = require('express')
var router = express.Router()
var Article = require('../models/Articles.js')
var Comment = require('../models/Comments.js')
var mongoose = require("mongoose")
// Snatches HTML from URLs
var request = require("request")
var rp = require('request-promise');
// Scrapes our HTML
var cheerio = require("cheerio")

//this is the users_controller.js file
router.get('/', function (req, res) {
  rp(`http://pitchfork.com/reviews/albums/`, function (error, response, html) {

    // Load the HTML into cheerio
    var $ = cheerio.load(html);

    $('.review').each(function (i, element) {
      let link = $(element).children().attr("href");
      let artist = $(element).find('.artist-list').text();
      let album = $(element).find('h2.title').text();
      let artwork = $(element).find("img").attr("src");
      
      let reviewObj = {
        artist: artist,
        album: album,
        url: `http://www.pitchfork.com${link}`,
        artwork: artwork
      }
      let Review = new Article(reviewObj);

      Article.find({album: reviewObj.album}).exec(function(err,doc) {
        if (doc.length) {
          console.log("Review already exists!")
        } else {
            Review.save(function (err,doc) {
              if (err) {
                res.send(err)
              } else {
                console.log("review inserted")
              }
            })
        }
      })
    });
  }).then(function() {
      Article.find({}).populate('comments').exec(function(err,doc) {
            if (err) {
              res.send(err);
            } else {
              let reviewList = {
                reviewList : doc
              }
              res.render('index', reviewList);
            }
          });
  })
});

router.get('/:id', function(req,res){
  let id = req.params.id;
  let reviewUrl;
    Article.find({_id: id}).exec(function(err,doc){
      reviewUrl = doc[0].url
      console.log(reviewUrl);
      request(reviewUrl, function (error, response, html) {
        let $ = cheerio.load(html);
        let score = $('.score').html();
        res.json(html);
      });
    })
})




module.exports = router;
