const express = require('express')
const app = express();
const mysql = require('mysql');
const {promisify} = require('util')
const port = process.env.PORT || 8080
const connection = mysql.createConnection({
    host: '.us-west-2.rds.amazonaws.com', // HOST NAME
    user: 'user', // USER NAME
    database: 'database', // DATABASE NAME
    password: 'pass' // DATABASE PASSWORD
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

//listening the server

//routes
app.use(require('./routes/routes'))

app.get('/gps', async(req, res)=>{
    await connection.query('SELECT * FROM gps ORDER BY idGPS DESC',(err,rows)=>{
        if(err) throw err
        location = rows[0]
        lat = location.Lat
        lon = location.Lon
        date = location.Fecha
        time = location.Hora
    })  
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


