const router = require('express').Router();

router.get('/',(req,res)=>{
    res.send(__dirname+'/views/index.html');
});
router.get('/aboutUS',(req,res)=>{
    res.sendFile(__dirname+'/aboutUS.html');
});
 

module.exports = router;