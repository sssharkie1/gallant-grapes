$(document).ready(function() {
$(".progress").hide();
$(".results").hide();

// Variables
var zipcode = 0, // to be replaced with user input
    zipcodeArr = []; // holds list of zip codes within 5 miles (returned from zip code api)

var brewery = []; // holds every brewery info 
var beer = [];

var brewCount = 0; 
var beerCount = 0;
var brewExist = true; // purpose: if brewery has already been written to html page, brewExist will === false

// User selected criteria
var srmMin = 0,
    srmMax = 100,
    ibuMin = 0,
    ibuMax = 100,
    abvMin = 0,
    abvMax = 100;

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

// Functions
function grabBeer() { // Purpose: check all beers of every brewery and match it to user criteria 

  if(beerCount < brewery.length){ // purpose: count how many times AJAX call has been run (should be = to # of breweries)
    
    var queryBreweryURL = "https://utcors1.herokuapp.com/https://api.brewerydb.com/v2/brewery/" + brewery[beerCount].id + "/beers/?key=9bb3bc076d572ad09b636ac87cc944c9";

    $.ajax({
      url: queryBreweryURL,
      method: "GET",
      headers: { "X-Requested-With": "" }
    }).done(function(response){

      if(response.hasOwnProperty("data")){ // makes sure brewery HAS beers available   
        // var beer = [];        
        var beerResult = response.data;
        var noBeersCount = 0;//single beer that doesn't match user input within for loop
        var noMatchingBeers = 0;//no beers match within brewery

        for (var j = 0; j < beerResult.length; j++) { // for loop to add qualified beers from 1 brewery to array
          var falseCount = 0; // purpose: checks how many criteria it meets (0 = meets all 3 criteria, 1 = close match)
          beerInfo = {"Name" : beerResult[j].name,
                      "ABV" : beerResult[j].style.abvMax,
                      "Hoppiness" : beerResult[j].style.ibuMin,
                      "Color" : beerResult[j].style.srmMin,
                      "Description" : beerResult[j].style.description
                      } //end of beerInfo object
          
          beer.push(beerInfo);

          // Checking if beer meets criteria
          if(Number(beerInfo.Color) > Number(srmMax) || Number(beerInfo.Color) < Number(srmMin)){
            falseCount++;
            // console.log(falseCount);
          }
          if(Number(beerInfo.Hoppiness) > Number(ibuMax) || Number(beerInfo.Hoppiness) < Number(ibuMin)){
            falseCount++;
            // console.log(falseCount);
          }
          if(Number(beerInfo.ABV) > Number(abvMax) || Number(beerInfo.ABV) < Number(abvMin)){
            falseCount++;
            // console.log(falseCount);
          }
          if(falseCount === 0 || falseCount === 1){
            if(brewExist === true){
              $(".progress").hide();

              var brewDiv = $("<div id='brewery" + beerCount + "'>")
                .append("<br><b> Brewery: </b>" + brewery[beerCount].name + "<br>" + 
                  "<a target = '_blank' href='" + brewery[beerCount].website + "'>" + brewery[beerCount].website + "</a>" + 
                  "<br><b>Address: </b>" + "<p>" + brewery[beerCount].streetName + 
                  "<br>" + brewery[beerCount].locality + ", " + brewery[beerCount].state + 
                  " " + brewery[beerCount].postalCode + "</p>");

              $("#beerResults").append(brewDiv);

              var exactDiv = $("<div id='exact" + beerCount + "'>").append("<br>");
              var closeDiv = $("<div id='close" + beerCount + "'>").append("<br>");

              $("#brewery" + beerCount).append(exactDiv).append(closeDiv);
              
              brewExist = false;
            }

            if(falseCount === 0){ // beer meets exact criteria
              if (!beer[j].Name) {beer[j].Name = "Not Available"};
              if (!beer[j].ABV) {beer[j].ABV = "Not Available"};
              if (!beer[j].Hoppiness) {beer[j].Hoppiness = "Not Available"};
              if (!beer[j].Color) {beer[j].Color = "Not Available"};
              if (!beer[j].Description) {beer[j].Description = "Not Available"};
                
              var p = $("<p>").append("*Perfect Match* Name of Beer: " + beer[j].Name + " | ABV: " + beer[j].ABV + "% | Hoppiness: " + beer[j].Hoppiness + " | Color: " + beer[j].Color);     
              $("#exact" + beerCount).append(p); 
            }

            else if(falseCount === 1){ // beer is close to meeting criteria
              if (!beer[j].Name) {beer[j].Name = "Not Available"};
              if (!beer[j].ABV) {beer[j].ABV = "Not Available"};
              if (!beer[j].Hoppiness) {beer[j].Hoppiness = "Not Available"};
              if (!beer[j].Color) {beer[j].Color = "Not Available"};
              if (!beer[j].Description) {beer[j].Description = "Not Available"};

              var p = $("<p>").append("*Close Match* Name of Beer: " + beer[j].Name + " | ABV: " +
               beer[j].ABV + "% | Hoppiness: " + beer[j].Hoppiness + " | Color: " + beer[j].Color);     
              
              $("#close" + beerCount).append(p); 
              
            }
          } // end of if-statement for beer that meets criteria (exact or close)  
          else if (falseCount > 1){
            noMatchingBeers++;
          }   
          if (noMatchingBeers === beerResult.length) {
            noBeersCount ++;
           }
        }// end of for loop for beerResult
  
      } // end of if statement checking if there are beers avail in brewery

      beerCount++;//counts up after all beers gone through at each brewery in array
      
      if(beerCount < brewery.length){ // prompts grabBeer to run again if there are more breweries to search through
        brewExist = true;
        grabBeer();
      }
      else if (noBeersCount ===beerCount){//no beers within existing brewery that match users input
        $("#beerResults").append("No Results: Please Try Again!");
        $(".progress").hide();
      }
    }) // end of function(response)
  }  
  else if (brewery.length === 0) {//no breweries in zipcode provided
    $("#beerResults").append("No Results: Please Try Again!");
    $(".progress").hide();

  }
};//end of grabBeer


function grabBrew() { // Purpose: add all breweries from all zip codes to brewery array
   
  if(brewCount < zipcodeArr.length){ // purpose: counts how many times the AJAX call has run;
      
    var queryURL = "https://utcors1.herokuapp.com/http://api.brewerydb.com/v2/locations/?key=9bb3bc076d572ad09b636ac87cc944c9&postalCode=" + zipcodeArr[brewCount];

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
                        "website": breweryResult[i].brewery.website,
                        // "picture": breweryResult[i].brewery.images.squareMedium
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
  else if (brewCount === 0){
    $("#beerResults").append("No Results");
  }
} // end function grabBrew()

function zipCode() { // Purpose: add all zip codes with 5 miles of user input zipcode to zipcodeArr

  var zipcodeURL = "https://utcors1.herokuapp.com/https://www.zipcodeapi.com/rest/rYEGWOzlRcstzfZD3PJSDntYcHBzvOIWNmDJbc43owwXLvBPlkIYIcXVTzvpndlb/radius.json/" + zipcode + "/5/mile?minimal"

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
  $(".progress").show();
  // Reset all variables and arrays
  zipcodeArr = [];
  brewery = [];
  beer = [];

  brewCount = 0;
  beerCount = 0; 
  brewExist = true;// Purpose: reset all variables, remove everything written to index.html
}

// Code to execute
$("input:radio").on("click", function() { // sets user selected ranges based on which button clicked

  var type = $(this).attr("name"); // grabs category (srm, ibv, abv)
  // Set all ranges
  if(type === "color"){ 
    srmMin = $(this).attr("colorMin");
    srmMax = $(this).attr("colorMax");
  }
  else if(type === "hoppy"){
    ibuMin = $(this).attr("ibuMin");
    ibuMax = $(this).attr("ibuMax");
  }
  else if(type === "alcohol"){
    abvMin = $(this).attr("abvMin");
    abvMax = $(this).attr("abvMax");
  }

}) // end on-click for buttons


$(document).on("click", "#submitButton", function() { // runs everything else
  startOver();
  $(".results").show();

  zipcode = document.getElementById("zipCode-input").value;
  
  if (zipcode.length <= 4 || zipcode.length > 5) {
    event.preventDefault();
    $(".invalidZip").remove();
    $(".progress").hide();
    $(".validZip").append("<p class = 'invalidZip'>" + "Enter Valid Zip Code" + "</p>");

  } 
  else {
    $(".invalidZip").remove();
      zipCode();
  }

  $("#zipCode-input").val(""); // clears zip code field

  database.ref().push({//adding set values to firebase
    srmMin,
    srmMax,
    ibuMin,
    ibuMax,
    abvMin,
    abvMax
});
  return false;

});//end of on click results

});//end of document
