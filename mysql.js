const mysql = require('mysql');
const pool = mysql.createConnection({
    host: '.us-west-2.rds.amazonaws.com', // HOST NAME
    user: 'user', // USER NAME
    database: 'database', // DATABASE NAME
    password: 'pass' // DATABASE PASSWORD
});

pool.connect(err=>{
    if(err) throw err
    console.log('Funciona')
})
pool.query('SELECT * FROM gps',(err,rows)=>{
    if(err) throw err
    console.log(rows)
})
