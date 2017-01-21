$("#zipCode-input").on("click", function() {

  console.log("click")
  function initMap() {
       var breweryLoc = {lat: 35.8706178, lng: -78.7174046};

       var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 12,
         center: breweryLoc
       });
       
       var marker = new google.maps.Marker({
         position: breweryLoc,
         map: map
       });
}

  $("#map").append(initMap());


})
     
