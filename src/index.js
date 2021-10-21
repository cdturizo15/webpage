const express = require('express')
const app = express();
const mysql = require('mysql');
const child_p = require('child_process')
const {promisify} = require('util');
require('dotenv').config()
const port = 8080
const connection = mysql.createConnection({
    host: process.env.HOST, // HOST NAME
    user: process.env.USER, // USER NAME
    database: 'taxiflow', // DATABASE NAME
    password: process.env.PASS // DATABASE PASSWORD
});
var lat = '';
var lon = '';
var date = '';
var time = '';
var currentInfo = '';


// settings
app.listen(port);

promisify(connection.query);
connection.connect(err=>{
    if(err) throw err
    console.log('DB connected')
})


//static
app.use(express.static(__dirname + '/views'));
app.use(express.json({limit: '1mb'}));

//listening the server

//routes
app.use(require('./routes/routes'))

app.post('/webhook', async(req,res)=>{
    child_p.exec('git reset --hard')
    child_p.exec('git pull origin master')
});

app.post('/timestamp',async(req,res)=>{
    coordinates = req.body
    let lat = coordinates[1]
    let lon = coordinates[0]
    let lati = parseFloat(lat)-0.0004
    let latf = parseFloat(lat)+0.0004
    let loni = parseFloat(lon)+0.0004
    let lonf = parseFloat(lon)-0.0004
    console.log(lati.toFixed(4))
    console.log(latf.toFixed(4))
    console.log(loni.toFixed(4))
    console.log(lonf.toFixed(4))
    connection.query(`SELECT * FROM taxiflow.location
            WHERE latitude BETWEEN '${lati.toFixed(4)}' AND '${latf.toFixed(4)}' AND longitude BETWEEN '${loni.toFixed(4)}' AND '${lonf.toFixed(4)}'`, function(error, rows){
        if(error){
            console.log("hi")
            throw error;
        }else{ 
            var timestamp = [];
            var infoTimeAndPos = [];
            var location = [];
            for (i in rows) {
                timestamp.push(rows[i].timestamp);
                location.push([rows[i].latitude, rows[i].longitude]);
                infoTimeAndPos.push([rows[i].latitude,rows[i].longitude,rows[i].timestamp]);
            }
        };   
        res.json(
            {
                infoTimeAndPos: infoTimeAndPos,
                location: location,
                dates: timestamp,
            }
        );     

    });
    
})

app.post('/dates',async(req,res)=>{
    dates = req.body
    var start = dates[0]+' '+dates[1]
    var end = dates[3]+' '+dates[2]
    connection.query(`SELECT * FROM taxiflow.location as l
                    INNER JOIN taxiflow.taxi as t ON l.idtaxi = t.idtaxi
                    WHERE timestamp >= '${start.toString()}' AND timestamp <= '${end.toString()}'
                    AND t.license_plate = '${dates[4].toString()}'`, function(error, rows){
        if(error){
            throw error;
        }else{ 
            var lattlngs = [];
            for (i in rows) {
                lattlngs.push([rows[i].latitude,rows[i].longitude]);
                
            }

        };   
        res.json(
            {
                latlon: lattlngs,
            }
        );           
    });
});

app.get('/cinfo', async(req, res)=>{
   connection.query(`WITH UNO AS (
                    SELECT  l.idtaxi, MAX(l.idlocation) AS maxfecha
                    FROM taxiflow.location as l
                    GROUP BY idtaxi
                    )
                    SELECT l.*, d.name, t.license_plate
                    FROM taxiflow.location AS l
                    INNER JOIN UNO AS q ON l.idtaxi = q.idtaxi AND l.idlocation = maxfecha
                    LEFT JOIN taxiflow.taxi AS t ON l.idtaxi  = t.idtaxi
                    LEFT JOIN taxiflow.driver AS d ON d.id_driver  = t.id_driver`, function (error, rows) {
        if (error) {
            throw error;
        } else {
            currentInfo = rows;
            vectorP = [];
            location = rows[0]
            lat = location.latitude;
            lon = location.longitude;
            date = location.date;
            time = location.time;


        };

    });

    res.json(
        {

            lat: lat,
            lon: lon,
            date: date,
            time: time,
            currentInfo: currentInfo,
        }
    );
})
 
// Port listening
app.listen(app.get('port'), () =>{
    console.log('Server on port', port);     
});
