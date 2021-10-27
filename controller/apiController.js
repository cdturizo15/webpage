const pool = require('../database/accedeDB');
const { database } = require('./keys');

const timestamp = async (req, res) => {
    coordinates = req.body
    let lat = coordinates[1]
    let lon = coordinates[0]
    let lati = parseFloat(lat) - 0.0004
    let latf = parseFloat(lat) + 0.0004
    let loni = parseFloat(lon) + 0.0004
    let lonf = parseFloat(lon) - 0.0004
    try {
        const response = await pool.query(`SELECT * FROM taxiflow.location
            WHERE latitude BETWEEN '${lati.toFixed(4)}' AND '${latf.toFixed(4)}' 
            AND longitude BETWEEN '${loni.toFixed(4)}' AND '${lonf.toFixed(4)}'`);
        console.log(response)
        var infoTimeAndPos = [];
        for (i in response) {
            infoTimeAndPos.push([response[i].latitude, response[i].longitude, response[i].timestamp]);
        }
        console.log(infoTimeAndPos)
        res.json(
            infoTimeAndPos)
    } catch (e) {
        console.error(e);
    }
};

const gpsDates = async (req, res) => {
    const dates = req.body;
    var start = dates[1];
    var end = dates[2];
    var lattlngs = {};
    try {
        if (dates[2] == '-') {
            const response = await pool.query(`SELECT * FROM taxiflow.location as l
            INNER JOIN taxiflow.taxi as t ON l.idtaxi = t.idtaxi
            WHERE timestamp >= "${dates[0]}" AND timestamp <= "${dates[1]}"`);
            
            let arrlicense_plate = []; 
            for (i in response) {
                arrlicense_plate.push(response[i].license_plate)
            }
            let uniqueL = [...new Set(arrlicense_plate)];

            uniqueL.forEach(e => {
                var l = [];
                var c;
                for (i in response) {
                    if (response[i].license_plate == e){
                        l.push([response[i].latitude,response[i].longitude])
                        c = response[i].color
                    };                
                }
                lattlngs[e] = {
                    'Location':l,
                    'Color':c}
                    
                console.log(lattlngs[e])
            });

        }else {
            const response = await pool.query(`SELECT * FROM taxiflow.location as l
                INNER JOIN taxiflow.taxi as t ON l.idtaxi = t.idtaxi
                WHERE timestamp >= "${dates[0]}" AND timestamp <= "${dates[1]}"
                AND t.license_plate = "${dates[2]}"`);
            
            let arrlicense_plate = []; 
            for (i in response) {
                arrlicense_plate.push(response[i].license_plate)
            }
            let uniqueL = [...new Set(arrlicense_plate)];

            uniqueL.forEach(e => {
                var l = [];
                var c;
                for (i in response) {
                    if (response[i].license_plate == e){
                        l.push([response[i].latitude,response[i].longitude])
                        c = response[i].color
                    };                
                }
                lattlngs[e] = {
                    'Location':l,
                    'Color':c}

                console.log(lattlngs[e])
            });

    }

        res.json(
            {
                latlon: lattlngs,
            }
        );
        //console.log(response)
        //console.log(lattlngs)
    } catch (e) {
        //console.error(e);
    }
};

const gpsLocation = async (req, res) => {
    try {
        const response = await pool.query(`WITH UNO AS (
            SELECT  l.idtaxi, MAX(l.idlocation) AS maxfecha
            FROM taxiflow.location as l
            GROUP BY idtaxi
            )
            SELECT l.*, d.name, t.license_plate
            FROM taxiflow.location AS l
            INNER JOIN UNO AS q ON l.idtaxi = q.idtaxi AND l.idlocation = maxfecha
            LEFT JOIN taxiflow.taxi AS t ON l.idtaxi  = t.idtaxi
            LEFT JOIN taxiflow.driver AS d ON d.id_driver  = t.id_driver`);
        currentInfo = response;
        vectorP = [];
        location = response[0]
        lat = location.latitude;
        lon = location.longitude;
        date = location.date;
        time = location.time;

        res.json({
            lat: lat,
            lon: lon,
            date: date,
            time: time,
            currentInfo: currentInfo,
        });
    } catch (e) {
        console.error(e);
    }
};


module.exports = {
    gpsLocation,
    gpsDates,
    timestamp
}