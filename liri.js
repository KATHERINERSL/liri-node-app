require("dotenv").config(); // imports dotenv
var fs = require("fs"); // imports filesystem
var axios = require("axios"); // Make XMLHttpRequests from the browser
var moment = require("moment"); // time formatter
var keys = require("./keys.js"); // imports keys.js files
var Spotify = require('node-spotify-api'); //spotify api npm

var spotify = new Spotify(keys.spotify); //access to spotify keys

var nodeCommand;
var nodeArgString;

var hRule = "--------------------------------------------------\n"; //formatting

var getMyInfo = {
    // get arguments from command line node liri.js <arguments>
    processArgs: function (arg) {
        var tempArray = [];
        nodeCommand = arg[2].toLowerCase();
        for (var i = 3; i < arg.length; i++) {
            tempArray.push(arg[i]);
        }
        nodeArgString = tempArray.join(" ");
        // console.log("nodeArgString:", nodeArgString);
        this.checkCommand(nodeCommand, nodeArgString);
    },

    // determine command
    checkCommand: function (nodeCmd, nodeArg) {
        switch (nodeCmd) {
            case "concert-this":
                this.concertThis(nodeArg);
                break;
            case "spotify-this-song":
                this.spotifyThis(nodeArg);
                break;
            case "movie-this":
                this.movieThis(nodeArg);
                break;
            case "do-what-it-says":
                this.doWhatItSays(nodeArg);
                break;
            default:
                console.log("Sorry, I don't know that command.");
                break;
        }
    },

    // concert-this uses the Bands In Town Artist Events API
    // format: node liri.js concert-this <artist/band name here>
    concertThis: function (query) {
        if (query === '') {
            query = 'George Strait';
        }
        axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp&display-limit=5").then(
            function (response) {

                var concertInfo = "";
                for (var i = 0; i < response.data.length; i++) {
                    // display JSON response
                    concertInfo += "Venue: " + response.data[i].venue.name + "\n";
                    concertInfo += "Location: " + response.data[i].venue.city + ", ";
                    if (response.data[i].venue.region) {
                        concertInfo += response.data[i].venue.region + ", ";
                    }
                    concertInfo += response.data[i].venue.country + "\n";
                    var date = moment(response.data[i].datetime, moment.ISO_8601).format("MM/DD/YYYY");
                    concertInfo += "Date of Event: " + date + "\n\n";
                    console.log(concertInfo);
                }

                // add to log.txt
                addToFile(nodeCommand, query, concertInfo);
            })
            .catch(function (error) {
                console.log(`Sorry, the band "${query}" could not be found.`);
            });

    },

    // spotify-this-song
    // format: node liri.js spotify-this-song '<song name here>'
    spotifyThis: function (query) {
        if (query === '') {
            query = 'The Chair';
        }
        spotify.search({ type: 'track', query: query, limit: 5 }, function (err, data) {
            if (err) {
                return console.log(`Sorry, "${query}" could not be found.`);
            }

            var songInfo = "";
            for (var i = 0; i < data.tracks.items.length; i++) {
                var artistsArray = [];
                // Artist or Artists logic
                if (data.tracks.items[i].artists.length > 1) {
                    songInfo += "Artists: "
                } else {
                    songInfo += "Artist: "
                }

                // concat multiple artists array
                for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
                    artistsArray.push(data.tracks.items[i].artists[j].name);
                }
                songInfo += artistsArray.join(", ") + "\n";
                songInfo += "Song Name: " + data.tracks.items[i].name + "\n";
                songInfo += "Preview Link: " + data.tracks.items[i].preview_url + "\n";
                songInfo += "Album: " + data.tracks.items[i].album.name + "\n\n";


                console.log(songInfo);
            }

            addToFile(nodeCommand, query, songInfo);

        });
    },

    // movie-this - use axios to retrieve data from OMDB API
    // format: node liri.js movie-this '<movie name here>'
    movieThis: function (query) {
        if (query === '') {
            query = 'Mr Nobody';
        }
        axios.get("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy")
            // success
            .then(function (response) {
                // display JSON response
                var movieInfo = "Title: " + response.data.Title + "\n";
                movieInfo += "Year: " + response.data.Year + "\n";
                movieInfo += "IMDB Rating: " + response.data.Ratings[0].Value + "\n";
                movieInfo += "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n";
                movieInfo += "Country: " + response.data.Country + "\n";
                movieInfo += "Language: " + response.data.Language + "\n";
                movieInfo += "Plot: " + response.data.Plot + "\n";
                movieInfo += "Actors: " + response.data.Actors + "\n";
                // PUSH TO FILE

                addToFile(nodeCommand, query, movieInfo);
                console.log(movieInfo);
                // DATE, COMMAND, PARAMETER - LOG should be short, not have everything.
                // LOGS are concise.
            })
            // catch any errors
            .catch(function (error) {
                // console.log("!!!ERROR!!!:", error);
                console.log(`Sorry, the movie "${query}" was not found in the OMBD`);
            })

    },

    // do-what-it-says
    // format: node liri.js do-what-it-says
    doWhatItSays: function (query) {
        // FS read method
        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            // check data from file
            console.log(data);

            // split into array
            var dataArray = data.split(",");

            // call the checkCommand method
            getMyInfo.checkCommand(dataArray[0], dataArray[1]);

        });
    }
}

// BONUS In addition to logging the data to your terminal/bash 
// window, output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file.

// APPEND searches to log.txt
function addToFile(nodeCmd, query, info) {
    var logFile = hRule + "[" + moment().format("MM/DD/YYYY") + "] ";
    logFile += nodeCmd + " " + query + "\n" + hRule + info;

    fs.appendFile("log.txt", logFile + "\n", function (err) {
        if (err) {
            return console.log(err);
        }
        else {
            console.log("log.txt file was appended!");
        }
    });
};


getMyInfo.processArgs(process.argv);