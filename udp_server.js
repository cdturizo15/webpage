
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'',
    port: 3306,
    user: '', 
    database: 'taxiflow', 
    password: ''
});

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('DB connected')
    }
});


socket.on('listening', () => {
    console.log(`UDP server listening on port 9000` );
  });

socket.on('message',(message)=>{
    console.log('message: '+ message);
    const lat = String(message).substr(17,11);
    const lon = String(message).substr(31,11);
    const date = String(message).substr(62,11);
    const time = String(message).substr(73,9);
    const license_plate = String(message).substr(104,7);
    console.log(lon);
    console.log(date);
    console.log(time);
    console.log(license_plate);

    connection.query(`SELECT license_plate, idtaxi FROM taxiflow.taxi
                    WHERE license_plate="${license_plate}"`, function(error, rows){
        if(error){
            throw error;
        }else{
            rows.forEach(rows =>{
                console.log(rows);
                const idtaxi = rows.idtaxi;
                console.log(idtaxi);  
                
                connection.query(`INSERT INTO taxiflow.location (idtaxi, latitude, longitude, date, time) VALUES ("${idtaxi}", "${lat}", "${lon}", "${date}", "${time}")`, function(error, results){
                    if(error){
                        throw error; 
                    }else{
                        console.log("Added", results);
                        };
                });

                connection.query(`SELECT * FROM taxiflow.location ORDER BY idlocation DESC`, function(error, rows){
                    if(error){
                        throw error;
                    }else{
                            location = rows[0]
                            console.log(location) 
                            const lat = location.latitude;
                            const lon = location.longitude;
                            const date = location.date;
                            const time = location.time;
                        
                            console.log(lat)
                            console.log(lon) 
                            console.log(date) 
                            console.log(time)
                    };
                    
                });
            });
        };
    });
});

socket.bind(process.env.UDPPORT)