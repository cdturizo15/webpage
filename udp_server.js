
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.HOST,
    port: 3306,
    user: process.env.USER,
    database: 'taxiflow', 
    password: process.env.PASS
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
    const lat = String(message).substr(18,8);
    const lon = String(message).substr(31,8);
    const date = String(message).substr(63,11);
    const time = String(message).substr(74,9);
    const timestamp = String(message).substr(63,19);
    const license_plate = String(message).substr(104,7);
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
                const start = '2021-09-28 01:08:18';
                const end = '2021-09-28 23:08:18';
                connection.query(`SELECT * FROM taxiflow.location
                            WHERE timestamp >= '${start}' AND timestamp <= '${end}'`, function(error, rows){
                    if(error){
                        throw error;
                    }else{ 
                        var latt = [];
                        for (i in rows) {
                            latt.push(rows[i].latitude);
                        }
                        console.log(latt)

                        console.log(rows[0])
                        console.log(rows[rows.length - 1])

                    };                    
                });
            });
        };
    });
});

socket.bind(process.env.UDPPORT)
