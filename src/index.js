const express = require('express')
const app = express();
const mysql = require('mysql');
const child_p = require('child_process')
const {promisify} = require('util')
const port = 8080
const connection = mysql.createConnection({
    host: process.env.HOST,
    port: 3306,
    user: process.env.USER,
    database: 'taxiflow', 
    password: process.env.PASS
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

app.post('/webhook', async(req,res)=>{
    child_p.exec('git reset --hard')
    child_p.exec('git pull origin master')
})

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
