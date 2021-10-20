const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
var fetchurl = location.hostname;
L.tileLayer(tileURL).addTo(map)
let markeri = null
let markerf = null
let popupMarker = null
var polyline = null
var button = document.getElementById('button-trace');
var button1 = document.getElementById('zoom');
var licenses = [];

button.addEventListener('click', function () {
  getHistory();
});
button1.addEventListener('click', function () {
  map.setView(latlngs[0], 17)
});

map.on('popupopen', async function () {
  
  var popup = polyline.getPopup();
  coordinates = [popup.getLatLng().lng.toFixed(4), popup.getLatLng().lat.toFixed(4)]
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(coordinates)
  }
  console.log(coordinates)
  const response = await fetch('/timestamp', options);
  const dates = await response.json();
  await popup.setContent('Pase por aqui: '+ dates.dates.length+' veces.\n'+'Ultima vez: '+dates.dates[dates.dates.length-1], {maxWidth: "2px"});

  console.log(dates.location)
  console.log(dates.location.length)
  infoTimePos = dates.infoTimeAndPos;
  document.getElementById("allDataDiv").innerHTML = "";
  infoTimePos.forEach(function (onelatlngs){
    let tag = document.createElement("p");
    let text = document.createTextNode("Fecha y hora: "+onelatlngs[2]);
    tag.appendChild(text);
    let tag2 = document.createElement("br");
    tag.appendChild(tag2);
    text = document.createTextNode("Latitud: "+onelatlngs[0]+" - Longitud: "+onelatlngs[1]);
    tag.appendChild(text);
    var element = document.getElementById("allDataDiv");
    element.appendChild(tag);
  })
});

async function getL() {
  response = await fetch('http://'+fetchurl+'/cinfo');
  coordinates = await response.json();
  currentInfo = coordinates.currentInfo
  currentInfo.forEach(function (info){
    console.log(licenses.length);
    licenses[licenses.length] = info.license_plate;
  });
  console.log(licenses);
  document.getElementById("licence-id").innerHTML = "";
  var i = 0;
  licenses.forEach(function (license){
    i++
    let tag = document.createElement("option");
    tag.value = i;
    let text = document.createTextNode(license);
    tag.appendChild(text);
    
    var element = document.getElementById("licence-id");
    element.appendChild(tag);
  })

}

async function getHistory() {
  const licence = document.getElementById("licence-id")
  const license = licence.options[licence.selectedIndex].text;
  const mesi = document.getElementById("date-1")
  const horai = document.getElementById("date-2")
  const mesf = document.getElementById("date-3")

  const horaf = document.getElementById("date-4")
  console.log(license)
  console.log(horai.value)
  console.log(horaf.value)
  if (mesi.value == '' || mesf.value == '') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor ingresar fechas'
    })
  }
  else {
    var firstDate = Date.parse(mesi.value + 'T' + horai.value)
    var lastDate = Date.parse(mesf.value + 'T' + horaf.value)
    if (horai.value == '') {
      horai.value = '00:01'
    }
    if (horaf.value == '') {
      horaf.value = '23:59'
    }
    var data = [mesi.value, horai.value, horaf.value, mesf.value, license]
    console.log(horai.value)
    if (firstDate > lastDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fechas invalidas'   
      })
      if (polyline) {
        map.removeLayer(polyline)
      }
      if (markeri) {
        map.removeLayer(markeri)
        map.removeLayer(markerf)
      }
    }
    else {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      const response = await fetch('/dates', options);
      const dates = await response.json();
      
      latlngs = dates.latlon;
      if (latlngs == '') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se encontraron registros'          
        })
      }
      else {
        if (polyline) {
          map.removeLayer(polyline)
        }
        if (markeri) {
          map.removeLayer(markeri)
          map.removeLayer(markerf)
        }
        markeri = L.marker(latlngs[0]).bindPopup('Initial position: ' + latlngs[0])
        markerf = L.marker(latlngs[latlngs.length - 1]).bindPopup('Final position' + latlngs[latlngs.length - 1])
        polyline = L.polyline(latlngs, { color: 'red', smoothFactor: 0.5 }).bindPopup()
      
        map.addLayer(polyline)
        map.addLayer(markeri)
        map.addLayer(markerf)


      }
    }
  }
}
getL();



