const mysql = require('mysql');
const pool = mysql.createConnection({
    host: 'taxiflowdatabase.c0u6vxuknyg3.us-west-2.rds.amazonaws.com', // HOST NAME
    user: 'taxiflow', // USER NAME
    database: 'location', // DATABASE NAME
    password: 'David5597' // DATABASE PASSWORD
});

pool.connect(err=>{
    if(err) throw err
    console.log('Funciona')
})
pool.query('SELECT * FROM gps',(err,rows)=>{
    if(err) throw err
    console.log(rows)
})