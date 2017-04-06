// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// make BookSchema a Schema
var ArticleSchema = new Schema({
  // author: just a string
  artist: {
    type: String
  },
  // title: just a string
  album: {
    type: String,
    validate: {
      validator: function (v, cb) {
        Article.find({ album: v }, function (err, docs) {
          cb(docs.length === 0)
        });
      },
      message: 'Entry already exists!'
    }
  },
  artwork: {
    type: String
  },
  url: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Note model
      ref: "Comments"
    }
  ]
});

// NOTE: the book's id is stored automatically Our Library model will have an
// array to store these ids Create the Book model with the BookSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model so we can use it on our server file.
module.exports = Article;
