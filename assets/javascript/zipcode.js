// Variables
	// User Input
	var color = "",
      	hoppiness = "",
      	abv = 0,
      	// style = "",
      	zipcode = 0

    // Comparison Rangers
    var srmMin = 0,
    	srmMax = 100,
    	ibuMin = 0,
    	ibuMax = 100,
    	abvMin = 0,
    	abvMax = 100

$("button:button").on("click", function() {

	var type = $(this).attr("category"); // grabs category (srm, ibv, abv)
	
	// Set all ranges
	if(type === "color"){ // probably not the best way to do this but i'm out of ideas 
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

})

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

});//end of on click for results probably not right because this was used on giphy.



var zipcode = 27613;
var radius = 10

var zipcodeURL = "http://utcors1.herokuapp.com/https://www.zipcodeapi.com/rest/b345qo4ak2sZAlNimGscHnkFGVUMDlRPpWVQlZ0F1sFBOsUa9mnQKHwqDrcgM45c/radius.json/" + zipcode + "/5/mile?minimal"

$.ajax({
	url: zipcodeURL,
	method: "GET",
	headers: { "X-Requested-With": "" } 
}).done(function(response){

		var zipCodes = response.zip_codes;
		console.log(zipCodes)
		// Stuff in here
	})


