window.onload = getMyLocation;

function getMyLocation () {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayLocation, displayError);
	} else  {
		alert("Ooops, no geolocation support");
	}
}
function displayLocation (position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;

	var km = computeDistance(position.coords, ourCoords);
	var distance = document.getElementById("distance");
	distance.innerHTML = "You are  " + km + " km from Wickedly Smart HQ";
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

function computeDistance(startCoords, destCoords) {
	startLatRads = degreesToRadians(startCoords.latitude);
	startLongRads = degreesToRadians(startCoords.longitude);
	endLatRads = degreesToRadians(destCoords.latitude);
	endLongRads = degreesToRadians(destCoords.longitude);

	var radius = 6371; // radius of the Earth in km
	var distance = Math.acos( Math.sin( startLatRads ) * Math.sin(endLatRads)  + Math.cos(startLatRads) * Math.cos(endLatRads) * Math.cos(startLongRads - endLongRads)) * radius;
	return distance ;
}

function degreesToRadians(degrees){
	var radians = (degrees * Math.PI) / 180;
	return radians;
}

var ourCoords = {
	latitude :  47.624851,
	longitude : -122.52099
}