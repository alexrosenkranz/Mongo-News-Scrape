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
    const $ = cheerio.load(html);

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
      setTimeout(Article.find({}).populate('comments').sort({date: -1}).exec(function(err,doc) {
        if (err) {
          res.send(err);
        } else {
          let reviewList = {
            reviewList : doc
          }
          res.render('index', reviewList);
        }
      }), 3000);
  }).catch(function(err){

  })
});

router.get('/review/:id', function(req,res){
  let id = req.params.id;
  // let reviewUrl;
    Article.find({_id: id}).populate('comments').exec(function(err,doc){
      let review = doc[0];
      let reviewUrl = review.url;
      let comments = [...review.comments]
      request(reviewUrl, function (error, response, html) {
        let $ = cheerio.load(html);
        let artist = review.artist
        let album = review.album
        let artwork = review.artwork
        let score = $('.score').html();
        let genre = $('.genre-list').text();
        genre = genre.replace(/([A-Z])/g, ' /$1').trim()
        let reviewText = $('.review-text').clone();
        reviewText.find('.featured-tracks').remove();
        

        let reviewBody = {
          artist: artist,
          album: album,
          artwork: artwork,
          score: score,
          genre: genre,
          body: reviewText,
          url: reviewUrl,
          comments: comments
        }
        console.log(reviewBody);

        res.render('review', reviewBody);
      });
    })
})




module.exports = router;
