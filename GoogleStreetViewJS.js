//GoogleAPIキー
var GoogleAPIKey = ''
var g_MapOpts;
var g_Map;
var g_Panorama;

function SetGoogleApiKey(){
	GoogleAPIKey = document.getElementById("GoogleApiKey1").value;
	Init();
}

function Init(){


	var srcURL = "https://maps.googleapis.com/maps/api/js?key=";
	srcURL += GoogleAPIKey;
	srcURL +="&callback=initMap";
	var s = document.createElement("script");
	s.src = srcURL;	

	var ele = document.getElementById("InitScriptTag");
	ele.appendChild(s);
	
	 
}

function initMap() {
  //g_MapOpts = {
  //  zoom: 14,//ズームレベル
  //  center: new google.maps.LatLng(35.6807527,139.7600500)
  //};
  //g_Map = new google.maps.Map(document.getElementById("map"), g_MapOpts);
  
  var fenway = {lat: 42.345573, lng: -71.098326};
  g_Map = new google.maps.Map(document.getElementById('map'), {
    center: fenway,
    zoom: 14
  });
  
  g_Panorama = new google.maps.StreetViewPanorama(
      document.getElementById('street'), {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
  g_Map.setStreetView(g_Panorama);
 
}

function Forward(){
	var prevHeading = g_Panorama.pov.heading;
	var prevPitch = g_Panorama.pov.pitch;
	
	var links = g_Panorama.getLinks();
	var nearestLink;
	
	var headingDiff = 360;
	var diff2
	for(var i=0; i<links.length; i++){
		diff2 = prevHeading - links[i].heading;
		diff2 = Math.abs(diff2);
		
		if(headingDiff >= diff2){
			nearestLink = links[i];
		}
	}
	
  //g_Panorama.setPov(/** @type {google.maps.StreetViewPov} */({
  //  heading: nearestLink.pov.heading,
  //  pitch: nearestLink.pov.pitch
  //}));
  g_Panorama.setPano(nearestLink.pano);
  g_Panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: prevHeading,
    pitch: prevPitch
  }));
}

function RotateRight(){
	var prevHeading = g_Panorama.pov.heading;
	var prevPitch = g_Panorama.pov.pitch;
	
	var newHeading = prevHeading + 10;
	var newPitch = prevPitch;
	
	if(newHeading >= 360){
		newHeading -= 360;
	}
	
  g_Panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: newHeading,
    pitch: newPitch
  }));
	
}

function RotateLeft(){
	var prevHeading = g_Panorama.pov.heading;
	var prevPitch = g_Panorama.pov.pitch;
	
	var newHeading = prevHeading - 10;
	var newPitch = prevPitch;
	
	if(newHeading <= -360){
		newHeading += 360;
	}
	
  g_Panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: newHeading,
    pitch: newPitch
  }));
}