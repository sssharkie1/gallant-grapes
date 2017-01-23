$(document).ready(function() {

// Variables
var brewery = []; // holds all brewery info

var counter = 0;
var beerCount = 0;

// User selected ranges
var srmMin = 0,
    srmMax = 100,
    ibuMin = 0,
    ibuMax = 100,
    abvMin = 0,
    abvMax = 100

// Firebase
var config = {
    apiKey: "AIzaSyBl1DC0XlwyV4UkPh0dyODExOW7zOA9RC0",
    authDomain: "gallant-grapes-1484705431926.firebaseapp.com",
    databaseURL: "https://gallant-grapes-1484705431926.firebaseio.com",
    storageBucket: "gallant-grapes-1484705431926.appspot.com",
    messagingSenderId: "605616569143"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().push({
  // variables to push to firebase
});


// Functions
function grabBeer() {   
  if(beerCount < brewery.length){ // AJAX only runs if conditions met
    
    var queryBreweryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + brewery[beerCount].id + "/beers/?key=9bb3bc076d572ad09b636ac87cc944c9";

    $.ajax({
      url: queryBreweryURL,
      method: "GET",
      headers: { "X-Requested-With": "" }
    }).done(function(response){

      if(response.hasOwnProperty("data")){ // makes sure brewery HAS beers available
        // APPEND BREWERY NAME TO HTML FIRST...NEVERMIND
        var beerDiv = $("<div class='beerOptions'>").append("<br> Brewery: " + brewery[beerCount].name + "<br>Address: " + brewery[beerCount].streetName + " " + brewery[beerCount].locality + ", " + brewery[beerCount].state + "<br>")
        $("#beerResults").append(beerDiv)

        var beer = [];
        
        var beerResult = response.data;

        for (var j = 0; j < 1; j++) { // for-loop to add all beers from 1 brewery
          var falseCount = 0;
          beerInfo = {"Name" : beerResult[j].name,
                      "ABV" : beerResult[j].style.abvMax,
                      "Hoppiness" : beerResult[j].style.ibuMin,
                      "Color" : beerResult[j].style.srmMin,
                      // "Category" : beerResult[j].style.category.name, <--- if using
                      "Description" : beerResult[j].style.description
                      }//end of beerInfo object
          
          // Checking if beer meets criteria
          if(Number(beerInfo.Color) > Number(srmMax) || Number(beerInfo.Color) < Number(srmMin)){
            falseCount++;
          }
          if(Number(beerInfo.Hoppiness) > Number(ibuMax) || Number(beerInfo.Hoppiness) < Number(ibuMin)){
            falseCount++;
          }
          if(Number(beerInfo.ABV) > Number(abvMax) || Number(beerInfo.ABV) < Number(abvMin)){
            falseCount++;
          }
          if(falseCount === 0){ // Beer meets criteria
            beer.push(beerInfo);
            
            // APPEND BEER TO HTML 
            var p = $("<p>").append("Name of beer: " + beer[j].Name + " | ABV: " + beer[j].ABV + "% | Hoppiness: " + beer[j].Hoppiness + " | Color: " + beer[j].Color);     
            $("#beerResults").append(p);
          }
          else if(falseCount === 1){ // Beer is close enough
            beer.push(beerInfo);

            // APPEND BEER TO HTML
            var p = $("<p>").append("*Close match* Name of beer: " + beer[j].Name + " | ABV: " + beer[j].ABV + "% | Hoppiness: " + beer[j].Hoppiness + " | Color: " + beer[j].Color);     
            $("#beerResults").append(p);
          }
         
        }//end of for loop for beerResult

      } // end of if statement
      beerCount++;
      if(beerCount < brewery.length){
        grabBeer();
      }
    //  console.log("hi")
    }) // end of function(response)
    }
  //} // end of for-loop
  
};//end of grabBeer


function grabBrew() { // Purpose: Add all breweries from all zip codes to brewery array
   
  if(counter < zipcodeArr.length){
      
    var queryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/locations/?key=9bb3bc076d572ad09b636ac87cc944c9&postalCode=" + zipcodeArr[counter];

    $.ajax({
      url: queryURL,
      method: "GET",
      headers: { "X-Requested-With": "" }
    }).done(function(response){

      if(response.hasOwnProperty("data")){ // makes sure zip code HAS breweries available
        var breweryResult = response.data; // array with brewery info as objects

        for (var i = 0; i < breweryResult.length; i++){ // for-loop to add all breweries from 1 zip code into array

          breweryInfo = {"id" : breweryResult[i].brewery.id,
                        "name" : breweryResult[i].brewery.name,
                        "latitude" : breweryResult[i].latitude,
                        "longitude" : breweryResult[i].longitude,
                        "streetName" : breweryResult[i].streetAddress,
                        "state" : breweryResult[i].region,
                        "locality": breweryResult[i].locality 
                        } //end of breweryInfo object

          brewery.push(breweryInfo); // pushes current brewery's entire info (stored as object) into array
        }   // end of for loop to add breweries 
      } //end of if statement
      counter++;
      if(counter < zipcodeArr.length){
        grabBrew();
      }
      else{ // if done pulling ALL brewery info, run grabBeer function
        grabBeer();
      }
    })//end of function(response)
  } // if statement
} // end function grabBrew()
    

// Code to execute
$("button:button").on("click", function() { // sets user selected ranges based on which button clicked

  var type = $(this).attr("category"); // grabs category (srm, ibv, abv)
  
  // Set all ranges
  if(type === "color"){ // if-statement is probably not the best way to do this but i'm out of ideas 
    srmMin = $(this).attr("colorMin");
    srmMax = $(this).attr("colorMax");
  }
  else if(type === "ibu"){
    ibuMin = $(this).attr("ibuMin");
    ibuMax = $(this).attr("ibuMax");
  }
  else if(type === "abv"){
    abvMin = $(this).attr("abvMin");
    abvMax = $(this).attr("abvMax");
  }

}) // end on-click for buttons


$(document).on("click", "#submitButton", function() { // runs everything else

    //clear results div or however is displayed in html
    // $("#beerResults").empty(); --> commented this out for now until we need it

    grabBrew();
    return false;

});//end of on click results

});//end of document
