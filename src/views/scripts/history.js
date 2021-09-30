const map = L.map('map-template').setView([10.96854, -74.78132], 13)
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
var fetchurl = location.hostname;
L.tileLayer(tileURL).addTo(map)
let markeri = null
let markerf = null
var polyline = null
var button = document.getElementById('button-trace');
var button1 = document.getElementById('zoom');

button.addEventListener('click', function () {
  getHistory();
});
button1.addEventListener('click', function () {
  map.setView(latlngs[0], 17)
});

async function getHistory() {
  const mesi = document.getElementById("date-1")
  const horai = document.getElementById("date-2")
  const mesf = document.getElementById("date-3")

  const horaf = document.getElementById("date-4")

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
    var data = [mesi.value, horai.value, horaf.value, mesf.value]
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
      console.log(dates);
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
        polyline = L.polyline(latlngs, { color: 'red', smoothFactor: 0.5 })
        map.addLayer(polyline)
        map.addLayer(markeri)
        map.addLayer(markerf)


      }
    }
  }
}


