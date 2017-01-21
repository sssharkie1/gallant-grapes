// Variables
	// User Input <--- are these necessary? (other than zipcode)
	var color = "",
      	hoppiness = "",
      	abv = 0,
      	// style = "",
      	zipcode = 0,
      	zipcodeArr = [];

    // User selected ranges
    var srmMin = 0,
    	srmMax = 100,
    	ibuMin = 0,
    	ibuMax = 100,
    	abvMin = 0,
    	abvMax = 100

// Sets comparison range to whatever user clicks on
$("button:button").on("click", function() {

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



function zipCode() { // Purpose: add array of zip codes from zipcodeAPI database to "zipcodeArr"

	var zipcodeURL = "http://utcors1.herokuapp.com/https://www.zipcodeapi.com/rest/b345qo4ak2sZAlNimGscHnkFGVUMDlRPpWVQlZ0F1sFBOsUa9mnQKHwqDrcgM45c/radius.json/" + zipcode + "/5/mile?minimal"

	$.ajax({
		url: zipcodeURL,
		method: "GET",
		headers: { "X-Requested-With": "" } 
	}).done(function(response){

			zipcodeArr = response.zip_codes;

		}) // end of function(response)

} // end of function zipCode



