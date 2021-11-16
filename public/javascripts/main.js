const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
var fetchurl = location.hostname;
L.tileLayer(tileURL).addTo(map)
let marker = null
var sw = 0
var button = document.getElementById('zoom');
var droplicence = document.getElementById('licence-id');
var latlngs = [];
var polyline = null
var licenses = [];
var polylines = [];

var markers = L.markerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false
});


async function getCurrentInfo() {
  licence = document.getElementById("licence-id");
  license = licence.options[licence.selectedIndex].text;
  const data = [license];
  const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
}

  const response = await fetch('http://' + fetchurl + '/live', options);
  coordinates = await response.json();
  currentInfo = coordinates.currentInfo
  
  if(markers){
    markers.clearLayers();
  }

  document.getElementById("currentInfo").innerHTML = "";
  var taxiIcon = L.icon({
    iconUrl: '/images/taxiicon.png',
    iconSize:     [20, 17], // size of the icon
    //iconAnchor:   [18, 15], // point of the icon which will correspond to marker's location
});

  currentInfo.forEach(function (info){  
    marker = L.marker([info.latitude, info.longitude],{icon: taxiIcon})
    
    var popup = L.popup()
    .setContent(info.name+". "+"Placa: "+info.license_plate+"</br>"+"Last position: "+info.latitude+", "+info.longitude);
    marker.bindPopup(popup).openPopup();

    if(info.latitude != "" && droplicence.value != "0"){
      latlngs.push([info.latitude,info.longitude])
      polyline =  L.polyline(latlngs, {color: 'black',smoothFactor:0.5});
      //map.addLayer(polyline)
      //mappolyline.addTo(map);
      polylines.push(polyline);
      polyline.addTo(map)
      //consolevar polylines = L.layerGroup(polylineArray);

      // Add all polylines to the map
     //polylines.addTo(map);
    }  
   
    markers.addLayer(marker);


    let tag = document.createElement("p");
    tag.id = info.license_plate;
    //tag.setAttribute('href', "/historial");
    text = document.createTextNode(info.name);
    tag.appendChild(text);
    let tag1 = document.createElement("br");
    tag.appendChild(tag1);
    text = document.createTextNode("Placa: " + info.license_plate);
    tag.appendChild(text);
    let tag2 = document.createElement("br");
    tag.appendChild(tag2);
    text = document.createTextNode("Ubicación: " + info.latitude + ", " + info.longitude);
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

async function getL() {
  response = await fetch('http://' + fetchurl + '/licences');
  allLi = await response.json();
  allL = allLi.allL;
  allL.forEach(function (info) {
    licenses[licenses.length] = info.license_plate;
  });
  //console.log(licenses);

  document.getElementById("licence-id").innerHTML = "";

  var i = 0;
  let tag = document.createElement("option");
  tag.value = i;
  let text = document.createTextNode("TODO");
  tag.appendChild(text);
  var element = document.getElementById("licence-id");
  element.appendChild(tag);

  licenses.forEach(function (license) {
      //console.log(license);
      i++
      tag = document.createElement("option");
      tag.value = i;
      text = document.createTextNode(license);
      tag.appendChild(text);

      element = document.getElementById("licence-id");
      element.appendChild(tag);
  })
}
button.addEventListener('click', function () {
  if(document.getElementById("licence-id").value != 0){
    map.setView([currentInfo[0].latitude,currentInfo[0].longitude], 15);
  }else{
    map.setView([10.9583295,-74.791163502], 12);
  }
});
droplicence.addEventListener("change", function () {
  latlngs = []; 
  if (polylines) {
    polylines.forEach(function (item) {
        map.removeLayer(item)
   })};
  polyline = null
  polylines = [];
  getCurrentInfo();
  if(document.getElementById("licence-id").value != 0){
    map.setView([currentInfo[0].latitude,currentInfo[0].longitude], 14);
  }else{
    map
    .setView([10.9583295,-74.791163502], 12);
  }
});
getL();
setInterval(getCurrentInfo, 2000);
