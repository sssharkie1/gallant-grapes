$(document).ready(function() {

var config = {
    apiKey: "AIzaSyBl1DC0XlwyV4UkPh0dyODExOW7zOA9RC0",
    authDomain: "gallant-grapes-1484705431926.firebaseapp.com",
    databaseURL: "https://gallant-grapes-1484705431926.firebaseio.com",
    storageBucket: "gallant-grapes-1484705431926.appspot.com",
    messagingSenderId: "605616569143"
    };
    firebase.initializeApp(config);

  var database = firebase.database();


  var color = "",
      hoppiness = "",
      abv = 0,
      // style = "",
      zipcode = 0,
      brewery = [], // holds all brewery info
      beer = [];



  database.ref().push({
      // variables to push to firebase
    });

// THIS CODE IS AT LINE 30
  // //whatever id is for user inputs
  // $("#userinput").on("click", function() {
    
  //   //adjust ids to what individual user inputs will be
  //   color = $("#color-input").val().trim();
  //   hoppiness = $("#hoppiness-input").val().trim();
  //   abv = $("#abv-input").val().trim();
  //   style = $("#style-input").val().trim();
  //   zipcode = $("#zipcode-input").val().trim();

  //   return false;

  // });//end of on click for user input

  //may not be document click...change class or id to whatever submit button is?
  $(document).on("click", "#submitButton", function() { // changed id to #submit in the middle
    
    //adjust ids to what individual user inputs will be
    color = $(".colorButton").val().trim();
    hoppiness = $(".hoppinessButton").val().trim();
    abv = $(".ABVButton").val().trim();
    // style = $("#style-input").val().trim();
    zipcode = $("#zipCode-input").val().trim();

    //clear input fields
    $(".colorButton").val("");
    $(".hoppinessButton").val("");
    $(".ABVButton").val("");
    // $("#style-input").val("");
    $("#zipCode-input").val("");

    //clear results div or however is displayed in html
    $("#beerResults").empty();  
        
    //URL based on zipcode input
    var queryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/locations/?key=9bb3bc076d572ad09b636ac87cc944c9&postalCode=" + zipcode;
       
    // var queryBeerURL = "http://api.brewerydb.com/v2/beers/?key=9bb3bc076d572ad09b636ac87cc944c9&abv=";
    //must we define all items we are searching for in url?

    $.ajax({
      url: queryURL,
      method: "GET",
      headers: { "X-Requested-With": "" }
    }).done(function(response){

      var breweryResult = response.data; // array with brewery info as objects

      console.log(breweryResult)

      for (var i = 0; i < breweryResult.length; i++){ // for-loop to add all breweries into an array

        breweryInfo = {"id" : breweryResult[i].brewery.id,
                      "name" : breweryResult[i].brewery.name, 
                      "streetName" : breweryResult[i].streetAddress,
                      "state" : breweryResult[i].region,
                      "locality": breweryResult[i].locality 
                      } //end of breweryInfo object

        brewery.push(breweryInfo); // pushes current brewery's entire info (stored as object) into array

        // won't be in final code i think... i made this to see what is in the brewery array
        // $("#areaForResults").append("Brewery #" + i + "- id: " + breweryInfo.id + " name: " + breweryInfo.name + "<br>")

      } //end of for loop 

      beerFunction();
    })//end of function(response)

      function beerFunction() { 
        

        for (var i = 0; i < brewery.length; i++){ // for loop to make sure we go through all breweries
          var beerDiv = $("<div class='beerOptions'>").append("Brewery #" + i + " - ID: " + brewery[i].id + "| Name: " + brewery[i].name + "<br>")
          $("#beerResults").append(beerDiv);

          //URL for brewery based on queryURL to get beer at brewery to then search for other input
          var queryBreweryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + brewery[i].id + "/beers/?key=9bb3bc076d572ad09b636ac87cc944c9"
          //MAY NOT NEED NOW! url for finding the beer information


         $.ajax({
          url: queryBreweryURL,
          method: "GET",
          headers: { "X-Requested-With": "" }
          }).done(function(response){
          // may need to rename response since have response up above -- i think it should be okay as response again

          var beerResult = response.data;
          var length = beerResult.length;
          console.log(length)

          for (var j = 0; j < length; j++) {

          beerInfo = {"Name" : beerResult[j].style.name,
                      "ABV" : beerResult[j].style.abvMin,
                      "Hoppiness" : beerResult[j].style.ibuMin,
                      "Color" : beerResult[j].style.srmMin,
                      "Category" : beerResult[j].style.category.name,//if use
                      "Description" : beerResult[j].style.description
                      }//end of beerInfo object
                      
          beer.push(beerInfo);
        
          //if statements here for user input meeting criteria or call a function
               
          var p = $("<p>").append("Beer #" + j + " - ABV: " + beer[j].ABV + " Hoppiness: " + beer[j].Hoppiness + " Color: " + beer[j].Color + " Category " + beer[j].Category);
          console.log(beerDiv);

          beerDiv.append(p);
          $("#beerResults").append(beerDiv);

        }//end of for loop for beerResult
        }) // end of function(response)
      } // end of for-loop
    };//end of beerFunction

    return false;

  });//end of on click for results probably not right because this was used on giphy.



});//end of document
