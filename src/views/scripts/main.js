const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
var fetchurl = location.hostname;
L.tileLayer(tileURL).addTo(map)
let marker = null
var sw = 0
var button = document.getElementById('zoom');
var latlngs = [];
var polyline = null


async function getGPS() {
  response = await fetch('http://'+fetchurl+'/gps');
  coordinates = await response.json();
  document.getElementById("lat").textContent = coordinates.lat;
  document.getElementById("lon").textContent = coordinates.lon;
  document.getElementById("date").textContent = coordinates.date;
  document.getElementById("time").textContent = coordinates.time;

  if (marker) {
    map.removeLayer(marker)
  }
  if(polyline){
    map.removeLayer(polyline)
  }
  /* button.addEventListener('click', function () {
    map.setView([coordinates.lat, coordinates.lon], 17)
  }); */
  marker = L.marker([coordinates.lat, coordinates.lon]).bindPopup('Myposition')
  if(coordinates.lat != ""){
    latlngs.push([coordinates.lat,coordinates.lon])
  }  
  polyline = L.polyline(latlngs, {color: 'red',smoothFactor:0.5}).addTo(map)
  marker.addTo(map)
}

setInterval(getGPS, 2000);
