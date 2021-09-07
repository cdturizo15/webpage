const map = L.map('map-template').setView([10.96854,-74.78132],13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
L.tileLayer(tileURL).addTo(map)
let marker = null
var sw = 0
var checkbox = document.querySelector('input[type="checkbox"]');


async function getGPS() {
    response = await fetch("http://taxiflow.zapto.org/gps");
    coordinates = await response.json();
    document.getElementById("lat").textContent = coordinates.lat;
    document.getElementById("lon").textContent = coordinates.lon;
    document.getElementById("date").textContent = coordinates.date;
    document.getElementById("time").textContent = coordinates.time;
    
    if(marker){
        map.removeLayer(marker)
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
    if((coordinates.lat!='' && (sw == 0)) ){
        map.setView([coordinates.lat,coordinates.lon],17)
    }   
    marker = L.marker([coordinates.lat,coordinates.lon]).bindPopup('Myposition')
    map.addLayer(marker)
}

setInterval(getGPS, 2000);
