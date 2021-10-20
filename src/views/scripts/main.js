const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
var fetchurl = location.hostname;
L.tileLayer(tileURL).addTo(map)
let marker = null
var sw = 0
var button = document.getElementById('zoom');
var latlngs = [];
var polyline = null


async function getCurrentInfo() {
  response = await fetch('http://'+fetchurl+'/cinfo');
  coordinates = await response.json();
  currentInfo = coordinates.currentInfo
  //console.log(currentInfo)
  if (marker) {
    markers.clearLayers();
  }

  document.getElementById("currentInfo").innerHTML = "";
  currentInfo.forEach(function (info){
    let tag = document.createElement("p");
    let text = document.createTextNode("Conductor: "+info.name);
    tag.appendChild(text);
    let tag2 = document.createElement("br");
    tag.appendChild(tag2);
    text = document.createTextNode("Placa: "+info.license_plate);
    tag.appendChild(text);
    let tag3 = document.createElement("br");
    tag.appendChild(tag3);
    text = document.createTextNode("Fecha y hora: "+info.date+" "+info.time);
    tag.appendChild(text);
    let tag4 = document.createElement("br");
    tag.appendChild(tag4);
    text = document.createTextNode("Latitud: "+info.latitude+" - Longitud: "+info.longitude);
    tag.appendChild(text);
    var element = document.getElementById("currentInfo");
    element.appendChild(tag);

    marker = L.marker([info.latitude, info.longitude])
    
    var popup = L.popup()
    .setContent("Placa: "+info.license_plate+" Current position: "+info.latitude+" - "+info.longitude);
    marker.bindPopup(popup).openPopup();

    if(info.latitude != ""){
      latlngs.push([info.latitude,info.longitude])
    }  
    polyline = L.polyline(latlngs, {color: 'blue',smoothFactor:0.5})
    //map.addLayer(polyline)
    map.addLayer(marker)
  })  
}
async function getGPS() {
  console.log('ok')
 
  /*
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
  polyline = L.polyline(latlngs, {color: 'red',smoothFactor:0.5})
  map.addLayer(polyline)
  map.addLayer(marker)
  
}

const loopFunction = () => {
  getCurrentInfo();
} 

loopFunction();

setInterval(loopFunction, 2000);
