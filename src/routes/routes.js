const router = require('express').Router();


router.get('/',(req,res)=>{
    res.send(__dirname+'/views/index.html');
});


module.exports = router;