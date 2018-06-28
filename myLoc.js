window.onload = getMyLocation;

function getMyLocation () {
	//check if geolocation available
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayLocation, displayError);
	} else  {
		alert("Ooops, no geolocation support");
	}
}
function displayLocation (position) {

	//get current lat and long
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;

	//get distance from current position to hardcoded position in object ourCoords
	var km = computeDistance(position.coords, ourCoords);

	var distance = document.getElementById("distance");
	distance.innerHTML = "You are  " + km + " km from Wickedly Smart HQ";

	showMap(position.coords)
}

function displayError(error) {
	var errorTypes = {
		0 : "Unknown error",
		1 : "Permission denied by user",
		2 : "Position is not available",
		3 : "Request timed out"
	};
	var errorMessage = errorTypes[error.code];
	if(error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
	}
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}

// function for counting distance from current position to hardcoded position in object ourCoords
function computeDistance(startCoords, destCoords) {
	startLatRads = degreesToRadians(startCoords.latitude);
	startLongRads = degreesToRadians(startCoords.longitude);
	endLatRads = degreesToRadians(destCoords.latitude);
	endLongRads = degreesToRadians(destCoords.longitude);

	var radius = 6371; // radius of the Earth in km

	// havershine equation - count distance on shere
	var distance = Math.acos( Math.sin( startLatRads ) * Math.sin(endLatRads)  + Math.cos(startLatRads) * Math.cos(endLatRads) * Math.cos(startLongRads - endLongRads)) * radius;
	return distance ;
}

// to convert defrees in radians
function degreesToRadians(degrees){
	var radians = (degrees * Math.PI) / 180;
	return radians;
}

// Hardcoded object in purpose to count distance
var ourCoords = {
	latitude :  47.624851,
	longitude : -122.52099
}

//variable which will be holding Google map afer we create it
var map;

function showMap(coords){

	//LatLng is a consturctor
	var googleLatAndLong = new google.maps.LatLng(coords.latitude,  coords.longitude);
	var mapOptions = {
		zoom : 17,
		center : googleLatAndLong,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	}

	var mapDiv = document.getElementById("map");

	// Map is constructor from Google API which takes an element
	// and options and create and returns a map object
	map = new google.maps.Map(mapDiv, mapOptions);
}