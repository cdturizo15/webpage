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
const server = app.listen(port);
app.set('view engine','ejs')

//static
app.use(express.static(__dirname + '/views'));

//listening the server
function main (){
    //routes
    app.get('/',(req,res)=>{

        res.render(__dirname+'/views/index.html');
    });

    const server = app.listen(app.get('port'), () =>{
        console.log('Server on port', port);
        socket.on('message',(message)=>{
            console.log('message: '+ message)
            lat = String(message).substr(17,10)
            lon = String(message).substr(31,11)
            date = String(message).substr(63,11)
            time = String(message).substr(75,12)
        }); 
        socket.bind(9000)  
    });

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

    }
main();