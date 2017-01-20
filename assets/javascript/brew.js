$(document).ready(function() {

	var darkness = "";
	var hoppiness = "";
	var abv = 0;
	var style = "";
	var zipcode = 27613;
	var breweryID = [];


	//whatever id is for user inputs
	$("#userinput").on("click", function() {
	  //adjust ids to what individual user inputs will be
	  darkness = $("#darkness-input").val().trim();
	  hoppiness = $("#hoppiness-input").val().trim();
      abv = $("#abv-input").val().trim();
	  style = $("#style-input").val().trim();
	  zipcode = $("#zipcode-input").val().trim();

      //clear input fields
      $("#darkness-input").val("");
      $("#hoppiness-input").val("");
	  $("#abv-input").val("");
	  $("#style-input").val("");
	  $("#zipcode-input").val("");
      
      return false;
    
    });//end of on click for user input

	//may not be document click...change class or id to whatever submit button is?
  $(document).on("click", "#example", function() {
  	//clear results div or however is displayed in html
    // $("#areaForResults").empty();  
    	//URL based on zipcode input
    var queryURL = "http://api.brewerydb.com/v2/locations/?key=9bb3bc076d572ad09b636ac87cc944c9&postalCode=" + zipcode;
    	//URL for brewery based on queryURL to get beer at brewery to then search for other input
    var queryBreweryURL = "http://api.brewerydb.com/v2/brewery/" + breweryID + "/beers/?key=9bb3bc076d572ad09b636ac87cc944c9"
    	//MAY NOT NEED NOW! url for finding the beer information
	// var queryBeerURL = "http://api.brewerydb.com/v2/beers/?key=9bb3bc076d572ad09b636ac87cc944c9&abv=";
		//must we define all items we are searching for in url?

		

	$.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response){

        	var breweryResult = response.data;

        	for (var i = 0; i < breweryResult.length; i++){

        		breweryInfo = {"id": breweryResult[i].id,
        						"name": breweryResult[i].name,
        						"streetName": breweryResult[i].streetAddress,
        						"state": breweryResult[i].region,
        						"locality": breweryResult[i].locality 
        					  }
        		breweryID.push(breweryInfo);
        		console.log(breweryInfo);
        			alert("hello");

        		console.log(breweryID);

        	}//end of for loop 

        	// beerFunction();
        })//end of function(response)

    // function beerFunction() {

    // 	$.ajax({
    //       url: queryBreweryURL,
    //       method: "GET"
    //     }).done(function(response){

    //     	var beerResult = response.data;

    //     	for (var i = 0; i < beerResult.length; i++){
        		

    //     	}//end of for loop

    //     	//add in other URL using breweryID to do for loop for other info.
    //     		var beerResult = response.data;

    //     		for (var j = 0; j < beerResult.length; j++) {

    //     			//if statements here for user input meeting criteria?
        			
    //     			var beerDiv = "<div class = 'beerOptions'>";

    //     			abv = beerResult[i].abv;
    //     			hoppiness = beerResult[i].style.ibuMin;//need one for max
    //     			darkness = beerResult[i].style.srmMin; //need one for max
    //     			style = beerResult[i].style.name //only if decide to do style and if figure out way to do user input contains name
    //     			var p = $("<p>").text("Beers: " + abv + hoppiness + darkness +style);

    //     			beerDiv.append(p);
    //     			$("#id of beer area in html").append(beerDiv);
    //     		}
    // 	}//end of beerFunction




  });//end of on click for results probably not right because this was used on giphy.

});//end of document