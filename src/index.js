const express = require('express')
const app = express();
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
var location = 'pripra'


// settings
app.set('port',3000);
app.set('view engine','ejs')

//static
app.use(express.static(__dirname + '/views'));

//listening the server
function main (){
    //routes
    app.get('/',(req,res)=>{
        res.render(__dirname+'/views/index.ejs',{title: location});
    });
    const server = app.listen(app.get('port'), () =>{
        console.log('Server on port', app.get('port'));
        socket.on('message',(message)=>{
            console.log('message: '+ message)
            location = message
        });
        socket.bind(9000)
    setTimeout(update,5000)   
    });
}
function update(){
    app.get('/',(req,res)=>{
        res.render(__dirname+'/views/index.ejs',{title: location});
    });
}

main();