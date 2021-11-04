const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
var fetchurl = location.hostname;
L.tileLayer(tileURL).addTo(map)
let marker = null
var sw = 0
var button = document.getElementById('zoom');
var latlngs = [];
var polyline = null

var markers = L.markerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false
});


async function getCurrentInfo() {
  response = await fetch('http://'+fetchurl+'/live');
  coordinates = await response.json();
  currentInfo = coordinates.currentInfo
  
  if(markers){
    markers.clearLayers();
  }

  document.getElementById("currentInfo").innerHTML = "";

  currentInfo.forEach(function (info){  
    marker = L.marker([info.latitude, info.longitude])
    
    var popup = L.popup()
    .setContent(info.name+". "+"Placa: "+info.license_plate+"</br>"+"Last position: "+info.latitude+", "+info.longitude);
    marker.bindPopup(popup).openPopup();

    if(info.latitude != ""){
      latlngs.push([info.latitude,info.longitude])
    }  
    polyline = L.polyline(latlngs, {color: 'blue',smoothFactor:0.5})
    //map.addLayer(polyline)
    markers.addLayer(marker);

    let tag = document.createElement("p");
    let text = document.createTextNode("Placa: " + info.license_plate);
    tag.appendChild(text);
    let tag2 = document.createElement("br");
    tag.appendChild(tag2);
    text = document.createTextNode("Ubicación: " + info.latitude + " , " + info.longitude);
    tag.appendChild(text);
    let tag3 = document.createElement("br");
    tag.appendChild(tag3);
    text = document.createTextNode("RPM: " + info.rpm);
    tag.appendChild(text);
    var element = document.getElementById("currentInfo");
    element.appendChild(tag);
    
  })  
  map.addLayer(markers);
}

setInterval(getCurrentInfo, 2000);