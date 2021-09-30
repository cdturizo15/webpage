const express = require('express')
const app = express();
const mysql = require('mysql');
const child_p = require('child_process')
const {promisify} = require('util');
require('dotenv').config()
const port = 80
const connection = mysql.createConnection({
    host: 'taxiflowdatabase.c0u6vxuknyg3.us-west-2.rds.amazonaws.com', // HOST NAME
    user: 'taxiflow', // USER NAME
    database: 'taxiflow', // DATABASE NAME
    password: 'David5597' // DATABASE PASSWORD
});
var lat = '';
var lon = '';
var date = '';
var time = '';


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

app.post('/dates',async(req,res)=>{
    dates = req.body
    var start = dates[0]+' '+dates[1]
    var end = dates[3]+' '+dates[2]
    connection.query(`SELECT * FROM taxiflow.location
            WHERE timestamp >= '${start.toString()}' AND timestamp <= '${end.toString()}'`, function(error, rows){
        if(error){
            throw error;
        }else{ 
            var lattlngs = [];
            for (i in rows) {
                lattlngs.push([rows[i].latitude,rows[i].longitude]);
            }
            /*console.log(lattlngs)
            console.log(rows[0])
            console.log(rows[rows.length - 1])*/

        };   
        res.json(
            {
                latlon: lattlngs
            }
        );           
    });
});

app.get('/gps', async(req, res)=>{
    await connection.query(`SELECT * FROM taxiflow.location ORDER BY idlocation DESC`, function(error, rows){
        if(error){
            throw error;
        }else{
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
            time: time
        }
    );
})

// Port listening
app.listen(app.get('port'), () =>{
    console.log('Server on port', port);     
});
