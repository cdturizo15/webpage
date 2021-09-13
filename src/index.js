const express = require('express')
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 80
const pool = mysql.createPool({
    host: 'taxiflow@taxiflowdatabase.c0u6vxuknyg3.us-west-2.rds.amazonaws.com:3306', // HOST NAME
    user: 'taxiflow', // USER NAME
    database: 'taxiflow', // DATABASE NAME
    password: 'David5597' // DATABASE PASSWORD
});

// settings
app.listen(port);
const {promisify} = require('util');

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

//static
app.use(express.static(__dirname + '/views'));

//listening the server

//routes
app.use(require('./routes/routes'))
// Port listening
app.listen(app.get('port'), () =>{
    console.log('Server on port', port);     
});


