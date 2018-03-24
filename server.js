// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const app = express();
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var path = require("path");



app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// Override with POST having ?_method=DELETE
app.use(methodOverride('_method'));



// Database configuration
const databaseUrl = "nyt_db";
const collections = ["scrapedData"];
//require templates so you can save to MongoDB
const Saved = require('./models/saved.js');
const Times = require('./models/times.js');


mongoose.connect("mongodb://localhost:27017/nyt_db");
var db = mongoose.connection;



// Make a request call to grab the HTML body from the site of your choice
request("https://www.nytimes.com/", function (error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];

    //scrapping the NYT wbsite
    $('.story-heading').each(function (i, element) {
        if (i < 10){
            var title = $(element).children().text();
            var link = $(element).children().attr('href');
            results.push({
                title: title,
                link: link
            });
        }
    })

    results.forEach(element => {        
        var newTimes = new Times({
            title: element.title,
            link: element.link
        })

        // console.log('Here is the obj', newTimes);

        newTimes.save().then(result => {
            //saving newTimes into the saved db.
        });
    })

});


// Main route (simple Hello World Message)
// app.get("/", function (req, res) {
//     res.sendFile('C:/Users/lowan/Desktop/Week 18 hw/nyt-scrapper/public/index.html');
// });

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/", function(req, res){
    var data;

    // try {
    //     const results = Times.find({});
    //     var nytObj = {
    //         times: results,
    //     };
    //     console.log('Hitting this..');
    //     res.render('index', nytObj);
    // } catch (error) {
    //     throw error;
    // }

    Times.find({}).then(doc => {
        var nytObj = {
            times: doc,
        };
        res.render("index", nytObj);
    }).catch((err) => {
        res.json(err);
    }); 
 
    // path.join(__dirname + '/index.html');
})

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?
app.get('/saved', function(req, res){
    res.render("saved");
})

app.post("/saved", function(req, res){
    console.log("Here's the req.body being sent to /saved on click...")
    console.log(req.body)
    res.render("saved");
})

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});