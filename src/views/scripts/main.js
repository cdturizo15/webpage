const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
L.tileLayer(tileURL).addTo(map)
let marker = null

var zoomButton = document.querySelector('.zoom-to-data-buttom');
const sw = 0;

async function getGPS() {
    response = await fetch("http://dierickb.hopto.org/gps");
    coordinates = await response.json();
    document.getElementById("lat").textContent = coordinates.lat;
    document.getElementById("lon").textContent = coordinates.lon;
    document.getElementById("date").textContent = coordinates.date;
    document.getElementById("time").textContent = coordinates.time;

    if (marker) {
        map.removeLayer(marker)
    }
    if ((coordinates.lat != '')) {
        marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map).bindPopup("s")
        map.addLayer(marker)

    }
    L.marker([coordinates.lat, coordinates.lon])
}

zoomButton.addEventListener('click', function () {
    map.setView([coordinates.lat, coordinates.lon], 15)
});

setInterval(getGPS, 2500);
