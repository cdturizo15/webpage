
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.HOST, // HOST NAME
    user: process.env.USER, // USER NAME
    database: 'taxiflow', // DATABASE NAME
    password: process.env.PASS // DATABASE PASSWORD
});

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('DB connected')
    }
});


socket.on('listening', () => {
    console.log(`UDP server listening on port 9000`);
  });

socket.on('message',(message)=>{
    console.log('message: '+ message);
    const lat = String(message).substr(0,7);
    const lon = String(message).substr(10,8);
    const date = String(message).substr(21,10);
    const time = String(message).substr(30,9);
    const timestamp = String(message).substr(22,18);
    const license_plate = String(message).substr(44,8);
    console.log(lat);
    console.log(lon);
    console.log(date);
    console.log(time);
    console.log(license_plate);
    console.log(timestamp);

    connection.query(`SELECT license_plate, idtaxi FROM taxiflow.taxi
                    WHERE license_plate="${license_plate}"`, function(error, rows){
        if(error){
            throw error;
        }else{
            rows.forEach(rows =>{
                console.log(rows);
                const idtaxi = rows.idtaxi;
                console.log(idtaxi);  
                
                connection.query(`INSERT INTO taxiflow.location (idtaxi, latitude, longitude, date, time, timestamp) VALUES ("${idtaxi}", "${lat}", "${lon}", "${date}", "${time}", "${timestamp}")`, function(error, results){
                    if(error){
                        throw error; 
                    }else{
                        console.log("Added :", results);
                        };
                });

                connection.query(`SELECT * FROM taxiflow.location ORDER BY idlocation DESC`, function(error, rows){
                    if(error){
                        throw error;
                    }else{
                            location = rows[0]
                            console.log(location); 
                    };
                });
            });
        };
    });
});

socket.bind(process.env.UDPPORT)
