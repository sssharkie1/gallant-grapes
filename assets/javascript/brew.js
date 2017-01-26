$(document).ready(function() {

// Variables
var zipcode = 0, // to be replaced with user input
    zipcodeArr = []; // holds list of zip codes within 5 miles (returned from zip code api)

var brewery = []; // holds every brewery info 

var brewCount = 0; 
var beerCount = 0;
var brewExist = true; // purpose: if brewery has already been written to html page, brewExist will === false

// User selected criteria
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
function checkBeer(){ // Purpose: check beer against criteria



  beerCount++;
  if(beerCount < brewery.length){ // prompts grabBeer to run again if there are more breweries to search through
    brewExist = true;
    grabBeer();
  }
}

function grabBeer() { // Purpose: check all beers of every brewery and match it to user criteria 

  if(beerCount < brewery.length){ // purpose: count how many times AJAX call has been run (should be = to # of breweries)
    
    var queryBreweryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + brewery[beerCount].id + "/beers/?key=9bb3bc076d572ad09b636ac87cc944c9";

    $.ajax({
      url: queryBreweryURL,
      method: "GET",
      headers: { "X-Requested-With": "" }
    }).done(function(response){

      if(response.hasOwnProperty("data")){ // makes sure brewery HAS beers available   

        var beer = [];
        
        var beerResult = response.data;

        for (var j = 0; j < beerResult.length; j++) { // for loop to add qualified beers from 1 brewery to array
          var falseCount = 0; // purpose: checks how many criteria it meets (0 = meets all 3 criteria, 1 = close match)

          beerInfo = {"Name" : beerResult[j].name,
                      "ABV" : beerResult[j].style.abvMax,
                      "Hoppiness" : beerResult[j].style.ibuMin,
                      "Color" : beerResult[j].style.srmMin,
                      "Description" : beerResult[j].style.description
                      } //end of beerInfo object
          
          // Checking if beer meets criteria
          if(Number(beerInfo.Color) > Number(srmMax) || Number(beerInfo.Color) < Number(srmMin)){
            falseCount++;
            console.log(falseCount);
          }
          if(Number(beerInfo.Hoppiness) > Number(ibuMax) || Number(beerInfo.Hoppiness) < Number(ibuMin)){
            falseCount++;
            console.log(falseCount);

          }
          if(Number(beerInfo.ABV) > Number(abvMax) || Number(beerInfo.ABV) < Number(abvMin)){
            falseCount++;
            console.log(falseCount);

          }
          if(falseCount === 0 || falseCount === 1){
            if(brewExist === true){
              var brewDiv = $("<div id='brewery" + beerCount + "'>").append("<br> Brewery: " + brewery[beerCount].name + "<br>" + "<a href=''>" + brewery[beerCount].website + "</a>" + "<br>Address: " + "<p>" + brewery[beerCount].streetName + "<br>" + brewery[beerCount].locality + ", " + brewery[beerCount].state + " " + brewery[beerCount].postalCode + "</p>" + "<br>");


              $("#beerResults").append(brewDiv);

              var exactDiv = $("<div id='exact" + beerCount + "'>").append("<br>");
              var closeDiv = $("<div id='close" + beerCount + "'>").append("<br>");

              $("#brewery" + beerCount).append(exactDiv).append(closeDiv);
              
              brewExist = false;
            }

            if(falseCount === 0){ // beer meets exact criteria

              beer.push(beerInfo);

              var p = $("<p>").append("Name of beer: " + beer[j].Name + " | ABV: " + beer[j].ABV + "% | Hoppiness: " + beer[j].Hoppiness + " | Color: " + beer[j].Color);     

              $("#exact" + beerCount).append(p);
            }
          
            else if(falseCount === 1){ // beer is close to meeting criteria
              
              beer.push(beerInfo);

              var p = $("<p>").append("*Close match* Name of beer: " + beer[j].Name + " | ABV: " + beer[j].ABV + "% | Hoppiness: " + beer[j].Hoppiness + " | Color: " + beer[j].Color);     
              $("#close" + beerCount).append(p);
            }
          } // end of if-statement for beer that meets criteria (exact or close)     
        }// end of for loop for beerResult
      } // end of if statement checking if there are beers avail in brewery
      
      checkBeer();

    }) // end of function(response)
  }  
};//end of grabBeer


function grabBrew() { // Purpose: add all breweries from all zip codes to brewery array
   
  if(brewCount < zipcodeArr.length){ // purpose: counts how many times the AJAX call has run;
      
    var queryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/locations/?key=9bb3bc076d572ad09b636ac87cc944c9&postalCode=" + zipcodeArr[brewCount];

    $.ajax({
      url: queryURL,
      method: "GET",
      headers: { "X-Requested-With": "" }
    }).done(function(response){

      if(response.hasOwnProperty("data")){ // purpose: makes sure zip code HAS breweries available
        var breweryResult = response.data; // array with brewery info as objects

        for (var i = 0; i < breweryResult.length; i++){ // purpose: add all breweries from 1 zip code into array

          breweryInfo = {"id" : breweryResult[i].brewery.id,
                        "name" : breweryResult[i].brewery.name,
                        "streetName" : breweryResult[i].streetAddress,
                        "state" : breweryResult[i].region,
                        "locality": breweryResult[i].locality,
                        "postalCode": breweryResult[i].postalCode,
                        "website": breweryResult[i].brewery.website
                        } //end of breweryInfo object

          brewery.push(breweryInfo); // purpose: pushes current brewery's entire info (stored as object) into brewery array
        }   // end of for loop to add breweries 
      } //end of if statement

      brewCount++;
      if(brewCount < zipcodeArr.length){ // run grabBrew again if there are still zip codes to search through for brewries
        grabBrew();
      }
      else{ // if done checking all zip codes for breweries, run grabBeer();
        grabBeer();
      }

    })//end of function(response)
  } // if statement
} // end function grabBrew()

function zipCode() { // Purpose: add all zip codes with 5 miles of user input zipcode to zipcodeArr

  var zipcodeURL = "http://utcors1.herokuapp.com/https://www.zipcodeapi.com/rest/rYEGWOzlRcstzfZD3PJSDntYcHBzvOIWNmDJbc43owwXLvBPlkIYIcXVTzvpndlb/radius.json/" + zipcode + "/5/mile?minimal"

  $.ajax({
    url: zipcodeURL,
    method: "GET",
    headers: { "X-Requested-With": "" },
  }).done(function(response){

    zipcodeArr = response.zip_codes; 
    grabBrew();

  }) // end of function(response)

} // end of function zipCode

function startOver(){
  $("#beerResults").empty() // clears previous beer + brewery results

  // Reset all variables and arrays
  zipcodeArr = [];
  brewery = [];

  brewCount = 0;
  beerCount = 0; 
  brewExist = true;// Purpose: reset all variables, remove everything written to index.html

}

    

// Code to execute
$("input:radio").on("click", function() { // sets user selected ranges based on which button clicked

  var type = $(this).attr("name"); // grabs category (srm, ibv, abv)
  // if statement here 
  
  // Set all ranges
  if(type === "color"){ 
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

  if(zipcodeArr.length > 0){
      startOver();
  }

  //clear results div or however is displayed in html
  // $("#beerResults").empty(); --> commented this out for now until we need it

  zipcode = document.getElementById("zipCode-input").value;
  
  if (zipcode.length <= 4 || zipcode.length > 5) {
    event.preventDefault();
    $(".invalidZip").remove();

    $("#zipCode-form").prepend("<p class = 'invalidZip'>" + "Enter Valid Zip Code" + "</p>");
  }
  else {
    $(".invalidZip").remove();
      zipCode();
  }

  $("#zipCode-input").val(""); // clears zip code field

  return false;

});//end of on click results

});//end of document
