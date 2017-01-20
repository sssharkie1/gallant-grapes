$(document).ready(function() {

	var color = "",
	    hoppiness = "",
	    abv = 0,
	    style = "",
	    zipcode = 0,
	    brewery = [],
        beer = [];



	//whatever id is for user inputs
	$("#userinput").on("click", function() {
	  //adjust ids to what individual user inputs will be
	  color = $("#color-input").val().trim();
	  hoppiness = $("#hoppiness-input").val().trim();
      abv = $("#abv-input").val().trim();
	  style = $("#style-input").val().trim();
	  zipcode = $("#zipcode-input").val().trim();

      //clear input fields
      $("#color-input").val("");
      $("#hoppiness-input").val("");
	  $("#abv-input").val("");
	  $("#style-input").val("");
	  $("#zipcode-input").val("");
      
      return false;
    
    });//end of on click for user input

	//may not be document click...change class or id to whatever submit button is?
  $(document).on("click", "#example", function() {
  	//clear results div or however is displayed in html
    $("#areaForResults").empty();  
    	//URL based on zipcode input
    var queryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/locations/?key=9bb3bc076d572ad09b636ac87cc944c9&postalCode=" + zipcode;
    	//URL for brewery based on queryURL to get beer at brewery to then search for other input
    var queryBreweryURL = "http://utcors1.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + breweryID[].id + "/beers/?key=9bb3bc076d572ad09b636ac87cc944c9"
    	//MAY NOT NEED NOW! url for finding the beer information
	// var queryBeerURL = "http://api.brewerydb.com/v2/beers/?key=9bb3bc076d572ad09b636ac87cc944c9&abv=";
		//must we define all items we are searching for in url?

	$.ajax({
          url: queryURL,
          method: "GET",
          headers: {
            "X-Requested-With": ""
          }
        }).done(function(response){

        	var breweryResult = response.data;

        	for (var i = 0; i < breweryResult.length; i++){

        		breweryInfo = {"id" : breweryResult[i].id,
        					   "name" : breweryResult[i].name,
        						"streetName" : breweryResult[i].streetAddress,
        						"state" : breweryResult[i].region,
        						"locality": breweryResult[i].locality 
        					  }//end of breweryInfo object
        		brewery.push(breweryInfo);
        		console.log(breweryInfo);

        		console.log(brewery);

        	}//end of for loop 

        	beerFunction();
        })//end of function(response)

    function beerFunction() {

    	$.ajax({
          url: queryBreweryURL,
          method: "GET",
          headers: {
            "X-Requested-With": ""
          }
        }).done(function(response){
            //may need to rename response since have response up above

        	var beerResult = response.data;

        	for (var j = 0; j < beerResult.length; j++) {

                beerInfo = {"beerName" : beerResult[i].name,
                            "beerABV" : beerResult[i].abv,
                            "beerHoppiness" : beerResult[i].style.ibuMin,
                            "beerColor" : beerResult[i].style.srmMin,
                            "beerStyle" : beerResult[i].style.category.name,//if use
                            "beerDescription" : beerResult[i].description
                    }//end of beerInfo object
                beer.push(beerInfo);
                console.log(beerInfo);
                console.log(beer);

                    
         			//if statements here for user input meeting criteria or call a function
        			var beerDiv = "<div class = 'beerOptions'>";
                    var p = $("<p>").text("Beers: " + abv + hoppiness + color +style);

        			beerDiv.append(p);
        			$("#id of beer area in html").append(beerDiv);
        		}//end of for loop for beerResult
        })
    	};//end of beerFunction

  });//end of on click for results probably not right because this was used on giphy.

});//end of document