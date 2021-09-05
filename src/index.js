const express = require('express')
const app = express();
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const port = process.env.PORT || 80

var lat = ''
var lon = ''
var date = ''
var time = ''


// settings
app.listen(port);

//static
app.use(express.static(__dirname + '/views'));

//listening the server

//routes
require('./routes/routes.js')
app.get('/gps', (req, res)=>{
    res.json(
        {
            lat: lat,
            lon: lon,
            date: date,
            time: time
        }
    );
})

// Port listening
app.listen(app.get('port'), () =>{
    console.log('Server on port', port);
    socket.on('message',(message)=>{
        console.log('message: '+ message)
        lat = String(message).substr(17,11)
        lon = String(message).substr(31,11)
        date = String(message).substr(63,11)
        time = String(message).substr(75,12)
    }); 
    socket.bind(9000)  
});


