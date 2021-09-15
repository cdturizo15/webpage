const mysql = require('mysql');
const pool = mysql.createConnection({
    host: 'database-taxiflow.caufp5btongz.us-west-2.rds.amazonaws.com', // HOST NAME
    user: 'taxiflow', // USER NAME
    database: 'taxiflow', // DATABASE NAME
    password: 'taxiflow' // DATABASE PASSWORD
});

pool.connect(err=>{
    if(err) throw err
    console.log('Funciona')
})
pool.query('SELECT * FROM gps',(err,rows)=>{
    if(err) throw err
    console.log(rows)
})