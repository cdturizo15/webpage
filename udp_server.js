
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

    var date27 = convertUTCDateToLocalDate(new Date(strDate));       

    const date = strDate.substr(0,10);
    const time = strDate.substr(11,8);

    const timestamp =date27.date+' '+date27.time;
    const license_plate = infoMsg[4];
    const rpm = infoMsg[5];

    console.log(date27);
    console.log(startTime);

    console.log(lat);
    console.log(lon);
    console.log(date27.date);
    console.log(date27.time);
    console.log(date27.timestamp);
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
                    VALUES ("${idtaxi}", "${lat}", "${lon}", "${date27.date}", "${date27.time}", "${date27.timestamp}", "${rpm}")`,
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
    var date
    var time

    newDate.setHours(hours);

    y=newDate.getFullYear();
    c=newDate.getDate();
    mo=newDate.getMonth()+1;

    ho=newDate.getHours();
    min=newDate.getMinutes();    
    seg=newDate.getSeconds();
    //console.log("FECHA:" +y+"-"+mo+"-"+c+" "+ho+":"+min+":"+seg)
    
    date1 = y+"-"+mo+"-"+c;
    
    if (String(ho).length == 1){
        console.log('ho',ho);
        ho = '0'+ho;
    }
    if (String(min).length == 1){
        console.log('min',min);
        min = '0'+min;
    }
    if (String(seg).length == 1){
        console.log('seg',seg);
        seg = '0'+seg;
    }
    newDate= y+"-"+mo+"-"+c+" "+ho+":"+min+":"+seg;
    
    time1 = ho+":"+min+":"+seg;  

    obejetoDate = {
        timestamp: newDate,
        date: date1,
        time: time1
    }

    return obejetoDate;
    
}

socket.bind(process.env.UDPPORT)

