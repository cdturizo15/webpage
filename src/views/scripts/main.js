const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
L.tileLayer(tileURL).addTo(map)
let marker = null
var sw = 0
var checkbox = document.querySelector('input[type="checkbox"]');
var latlngs = [];
var polyline = null


async function getGPS() {
  response = await fetch('http://localhost/gps');
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
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      // do this
      sw = 1
    } else {
      // do that
      sw = 0
    }
  });
  if ((coordinates.lat != '' && (sw == 0))) {1
    map.setView([coordinates.lat, coordinates.lon], 17)
  }
  marker = L.marker([coordinates.lat, coordinates.lon]).bindPopup('Myposition')
  latlngs.push([coordinates.lat,coordinates.lon])
  polyline = L.polyline(latlngs, {color: 'red',smoothFactor:0.5})
  map.addLayer(polyline)
  map.addLayer(marker)
  console.log(latlngs)
}

setInterval(getGPS, 2000);
