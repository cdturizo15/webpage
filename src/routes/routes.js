const router = require('express').Router();


router.get('/',(req,res)=>{
    res.send(__dirname+'/views/index.html');
});
router.get('/gps', (req, res)=>{
    res.json(
        {
            lat: lat,
            lon: lon,
            date: date,
            time: time
        }
    );
})

module.exports = router;