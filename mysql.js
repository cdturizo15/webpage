const mysql = require('mysql');
const pool = mysql.createConnection({
    host: '', // HOST NAME
    user: '', // USER NAME
    database: 'taxiflow', // DATABASE NAME
    password: '' // DATABASE PASSWORD
});

pool.connect(err=>{
    if(err) throw err
    console.log('Funciona')
})
pool.query('SELECT * FROM gps',(err,rows)=>{
    if(err) throw err
    console.log(rows)
})
