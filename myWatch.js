window.onload = getMyLocation;

//Geolocation have three main methods
/*
	1. getCurrentPosition
	2.watchPosition
	3.clearWatch

	getCurrent position uses some related objects
	1.Position (has two properties - coords and timestamp; coords - object of lat and long; timestamp - time when position object was created)
	2.Coordinates - is a child of position object and it has latitude, longitude, accurancy and four more properties  which may or may not support on device:
	altitude, altitudeAccuracy, heading, speed

	watchPosition - watch the user movements and reports location back when user location changes
*/

function getMyLocation () {
	//check if geolocation available
	if(navigator.geolocation) {

		var watchButton = document.getElementById("watch");
		watchButton.onclick = watchLocation;

		var clearWatch = document.getElementById("clearWatch");
		clearWatch.onclick = clearWatch;

	} else  {
		alert("Ooops, no geolocation support");
	}
}

var watchId = null;

function watchLocation() {
	watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
}

function clearWatch() {
	if(watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

function displayLocation (position) {

	// get current lat and long
	// position is object returned by getCurrentPosition
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var div = document.getElementById("location");
	div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
	div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)" ;

	//get distance from current position to hardcoded position in object ourCoords
	var km = computeDistance(position.coords, ourCoords);

	var distance = document.getElementById("distance");
	distance.innerHTML = "You are  " + km + " km from Wickedly Smart HQ";

	//position.coords is object of only lat and long
	if(map == null){
		showMap(position.coords)
	} else {
		scrollMapTopPosition(position.coords);
	}
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
	// Is used in mapOptions for centering map according to current position
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


	var title = "Your Location";
	var content = "You are here:  " + coords.latitude + ", " + coords.longitude;

	//Function for adding custom position marker
	// map - global variable
	// googleLatLong -  object with current position
	addMarker(map, googleLatAndLong, title, content);
}

function addMarker (map,  latlong, title, content) {
	var markerOptions = {
		position : latlong,
		map : map,
		title : title,
		clickable : true
	};
	var marker = new google.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content : content,
		position : latlong
	};

	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	// adding handler  on click event. When marker is clicked invoke open method of infoWindow object
	google.maps.event.addListener(marker, "click", function () {
		infoWindow.open(map);
	});
}
function scrollMapTopPosition(coords) {
	var latitude = coords.latitude;
	var longitude = coords.longitude;

	var latlong = new google.maps.LatLng(latitude, longitude);

	map.panTo(latlong);
	addMarker(map, latlong, "Your new location", "You moved to: " + latitude + ", " + longitude);
}