// Variables
var zipcode = 0,
	zipcodeArr = [];


// Functions
function zipCode() { // Purpose: add array of zip codes from zipcodeAPI database to "zipcodeArr"

	var zipcodeURL = "http://utcors1.herokuapp.com/https://www.zipcodeapi.com/rest/rYEGWOzlRcstzfZD3PJSDntYcHBzvOIWNmDJbc43owwXLvBPlkIYIcXVTzvpndlb/radius.json/" + zipcode + "/5/mile?minimal"

	$.ajax({
		url: zipcodeURL,
		method: "GET",
		headers: { "X-Requested-With": "" },
	}).done(function(response){

		zipcodeArr = response.zip_codes;

	}) // end of function(response)

} // end of function zipCode


// Code to execute

$("#enterButton").on("click", function(){
	zipcode = document.getElementById("zipCode-input").value;
	console.log("button");
	// zipcode = $("#zipCode-input").val().trim(); // sets "zipcode" to user input ******** need validation ********
	if (zipcode.length < 4 || zipcode.length > 5) {
		event.preventDefault();
		$(".invalidZip").remove();

		$("#zipCode-form").prepend("<p class = 'invalidZip'>" + "Enter Valid Zip Code" + "</p>");
		console.log("wrong zip");
	}
	else {
		$(".invalidZip").remove();
    	zipCode();
		}

    $("#zipCode-input").val(""); // clears zip code field

    return false;
})


