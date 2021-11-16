
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.HOST, // HOST NAME
    user: process.env.USER, // USER NAME
    database: 'taxiflow', // DATABASE NAME
    password: process.env.PASS// DATABASE PASSWORD
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
    var m = 'message,'+ message;
    console.log(m);
    var infoMsg = m.split(',');
    console.log(infoMsg);

    const lat = infoMsg[1];
    const lon = infoMsg[2];
    const milliseconds = parseInt(infoMsg[3]);
    const dateObject = new Date(milliseconds);
    const strDate = dateObject.toISOString();
    var startTime = new Date(strDate);
    startTime =   new Date( startTime.getTime() + ( startTime.getTimezoneOffset()*60000 ) );

    var date27 = convertUTCDateToLocalDate(new Date(strDate)) 
    console.log("Fecha cambio: "+date27);
       

    const date = strDate.substr(0,10);
    const time = strDate.substr(11,8);
    const timestamp = date + ' ' +time;
    const license_plate = infoMsg[4];
    const rpm = infoMsg[5];

    console.log(strDate);
    console.log(startTime);

    console.log(lat);
    console.log(lon);
    console.log(date);
    console.log(time);
    console.log(timestamp);
    console.log(license_plate);
    console.log(rpm);


    connection.query(`SELECT license_plate, idtaxi FROM taxiflow.taxi
                    WHERE license_plate="${license_plate}"`, function(error, rows){
        if(error){
            throw error;
        }else{
            rows.forEach(rows =>{
                console.log(rows);
                const idtaxi = rows.idtaxi;
                console.log(idtaxi);  
                
                connection.query(`INSERT INTO taxiflow.location (idtaxi, latitude, longitude, date, time, timestamp, rpm) 
                    VALUES ("${idtaxi}", "${lat}", "${lon}", "${date}", "${time}", "${timestamp}", "${rpm}")`,
                     function(error, results){
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

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours);

    y=newDate.getFullYear().padStart(2,'0');
    c=newDate.getDate().padStart(2,'0');
    mo=newDate.getMonth().padStart(2,'0');

    ho=newDate.getHours().padStart(2,'0');
    min=newDate.getMinutes().padStart(2,'0');    
    seg=newDate.getSeconds().padStart(2,'0');
    console.log("FECHA:" +y+":"+mo+":"+c+" "+ho+":"+min+":"+seg)
    

    return newDate;   
}

socket.bind(process.env.UDPPORT)

