$(document).ready(function() {

// Variables
var brewery = [], // holds all brewery info
    beer = []; // holds all beer info
var counter = 0; 
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

  for (var i = 0; i < brewery.length; i++){ // for-loop to make sure we go through all breweries in array
    
    var beerDiv = $("<div class='beerOptions'>").append("Brewery: " + brewery[i].name + "Address: " + brewery[i].streetName + " " + brewery[i].locality + brewery[i].state + "<br>")

    //URL for brewery based on queryURL to get beer at brewery to then search for other input
    var queryBreweryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + brewery[i].id + "/beers/?key=9bb3bc076d572ad09b636ac87cc944c9"
    

    $.ajax({
      url: queryBreweryURL,
      method: "GET",
      headers: { "X-Requested-With": "" }
    }).done(function(response){
      counter++;
      if(response.hasOwnProperty("data")){ // makes sure brewery HAS beers available

        var beerResult = response.data;

        for (var j = 0; j < beerResult.length; j++) { // for-loop to add all beers from 1 brewery

          beerInfo = {"Name" : beerResult[j].style.name,
                      "ABV" : beerResult[j].style.abvMax,
                      "Hoppiness" : beerResult[j].style.ibuMin,
                      "Color" : beerResult[j].style.srmMin,
                      // "Category" : beerResult[j].style.category.name, <--- if using
                      "Description" : beerResult[j].style.description
                      }//end of beerInfo object
                          
          beer.push(beerInfo);
            
          //if statements here for user input meeting criteria or call a function ***** TO-DO *****
                   
          var p = $("<p>").append("Beer: " + " - ABV: " + beer[j].ABV + " Hoppiness: " + beer[j].Hoppiness + " Color: " + beer[j].Color + " Style " + beer[j].Category);
          
          beerDiv.append(p);
          $("#beerResults").append(beerDiv);

          
        }//end of for loop for beerResult
      } // end of if statement
    }) // end of function(response)
  } // end of for-loop
  
};//end of grabBeer


function grabBrew() { // Purpose: Add all breweries from all zip codes to brewery array

  for (var j = 0; j < zipcodeArr.length; j++){ // for-loop to run through all zip codes in 5 mi radius
    //URL based on zipcode input
    var queryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/locations/?key=9bb3bc076d572ad09b636ac87cc944c9&postalCode=" + zipcodeArr[j];
       
    $.ajax({
      url: queryURL,
      method: "GET",
      headers: { "X-Requested-With": "" },
      success: function(){
        counter++;
      }
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

      // for(var k = 0; k < zipcodeArr.length; k++){
      //   counter++;
      // }
    })//end of function(response)
    
  } //end of for-loop zipcodeArr
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
    $(document).ajaxComplete(function(){
      if(counter === zipcodeArr.length){
          grabBeer();
        }
    })
    //setTimeout(function() {grabBeer();}, 600);
    return false;

});//end of on click for results probably not right because this was used on giphy.



});//end of document
