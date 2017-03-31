/* Showing Mongoose's "Populated" Method (18.3.6)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Snatches HTML from URLs
const request = require("request");
// Scrapes our HTML
const cheerio = require("cheerio");
const exphbs = require('express-handlebars');

mongoose.Promise = Promise;

const apiController = require("./controllers/apiController.js")
const htmlController = require("./controllers/htmlController.js")

// var Book = require("./models/Articles.js");
// var Library = require("./models/Users.js");

// Initialize Express
const app = express();
var PORT = process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18hw_db");
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function () {
  console.log("Mongoose connection successful.");
});

app.use('/', htmlController);
app.use('/api', apiController);




// Listen on port 3000
app.listen(PORT, function () {
  console.log(`App running on port ${PORT}!`);
});
