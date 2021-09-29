const router = require('express').Router();

router.get('/',(req,res)=>{
    res.send(__dirname+'/views/index.html');
});
router.get('/aboutUS',(req,res)=>{
    res.sendFile(__dirname+'/aboutUS.html');
});
 
router.get('/historial',(req,res)=>{
    res.sendFile(__dirname+'/historial.html');
});

module.exports = router;