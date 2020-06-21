require("dotenv").config();  

//require npm packages
var keys = require("./keys.js");
var inquirer = require("inquirer");
var axios = require("axios");
var fs = require("fs");

var spotify = new spotify(keys.spotify);


fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }
  console.log(data);
  var dataArr = data.split(",");
  for(i = 0; i < dataArr.length;i++){
    console.log(dataArr[i]);
  }

  //make the following commands and what each command should do: 


  //concert-this   <artist/band name here>
  //this will search the Bands in Town artist event API ("https://rest.bandsintown.com/artist/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information to the terminal
  // using HTTPS as written above with coding bootcamp, no need to get API key for bands in town
  //Name of the venue
  //venue location
  //Date of the event (use moment to format this as "MM/DD/YY")
  //do-what-it-says
  
  //spotify-this-song <song name here>
  //this will show the following information about song in the terminal/bash window
  //Artist(s)
  //the song's name 
  //A preview link of the song from spotify
  //The album that the song is from
  //if no song is provded then the program will default to "The Sign" by the Ace of Base.


  //Spotify API key
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: "edb57c3a549e479c9a60b6c179787be9",
  secret:"6a72bfd13791424e8e3b3fca186285a9",
      
});
spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
console.log(data); 
});


//spotify code from developer web

var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);

//movie-this <movie name here>
//this will output the follwoing information to the terminal/bash window.
//Title of movie
//Year the movie came out.
//IMDB rating of the movie.
//Rotten Tomatoes Rating of the movie.
//Country where the movie was produced.
//Language of the movie.
//Plot of the movie.
//Actors of the movie.

//if the user does not type a movie in the prgram will output data for the movie "MR. Nobody."
//will use the axios package to retrieve data from the OMDB API. use trilogy for the api.

//do-what-it-says
//using fs node package, LIRI will take the random.txt and then use it to call one of LIRI's commands: it should run "spotify-this-song for I Want It That Way".
//change up the txt in random.txt to change out the feature for movie-this to concert-this (????)
