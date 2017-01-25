// Variables
var zipcode = 0,
	zipcodeArr = [];


// Functions
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


