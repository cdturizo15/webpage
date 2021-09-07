const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
marker = L.marker([-74.7720435, 10.9303097])
const id = 'mapbox/streets-v11'
var marker = null

async function getGPS() {
    response = await fetch("http://dierickb.hopto.org/gps");
    coordinates = await response.json();
    document.getElementById("lat").textContent = coordinates.lat;
    document.getElementById("lon").textContent = coordinates.lon;
    document.getElementById("date").textContent = coordinates.date;
    document.getElementById("time").textContent = coordinates.time;

    const map = L.map('map-template').setView([coordinates.lat, coordinates.lon], 14)
    L.tileLayer(tileURL, { attribution, id }).addTo(map)

    if (marker) {
        map.removeLayer(marker)
    }
    if (coordinates.lat != '') {
        marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map).bindPopup("s")
    }
    L.marker([coordinates.lat, coordinates.lon])
}

setInterval(getGPS, 2000);