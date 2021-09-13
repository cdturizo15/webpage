const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'aqui va tu host', // HOST NAME
    user: 'aqui va tu usuario', // USER NAME
    database: 'aqui va nombre de base de datos', // DATABASE NAME
    password: 'aqui va contrasena del usuario' // DATABASE PASSWORD
});
var lat = ''
var lon = ''
var date = ''
var time = ''

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release();
    console.log('DB is connected');
    return;
})

socket.on('listening', () => {
    console.log(`Server listening on port 9000`);
  });

socket.on('message',(message)=>{
    console.log('message: '+ message)
    lat = String(message).substr(17,11)
    lon = String(message).substr(31,11)
    date = String(message).substr(62,11)
    time = String(message).substr(73,8)
});
socket.bind(9000)