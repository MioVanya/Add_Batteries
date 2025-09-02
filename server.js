require('dotenv').config();

const PORT = process.env.PORT || 9999;

let express = require('express');

let app = express();

app.use(express.static(__dirname));
app.use('/js', express.static(__dirname + '/js'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const http = require("http");

const mariadb = require('mariadb');

// Create a connection pool (recommended)
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '251286',
    database: process.env.DB_NAME || 'batterydb',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 5
});

pool.getConnection()
    .then(conn => {
        console.log("Bingo!");
        conn.release();
    })
    .catch(err => {
        console.error("Error:", err);
    });

let batteries = require("./js/newBatteries.js");
batteries.setPool(pool);

let server = http.createServer({}, app).listen(PORT, () => {
    console.log('Listening on ' + server.address().port);
    batteries.initialise();
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getBatteryList', async (req, res) => {
    const marka = req.query.marka;
    console.log("server:getBatteryList: Marka=" + marka);
    var batteryList = await batteries.getBatteryList(marka);
     if (!batteryList) batteryList = [];
    res.json(batteryList);
});

app.get('/BuyBattery', async function (req, res) {
    const batteryID = req.query.id;
    console.log("server:getBatteryList: ID=" + batteryID);
    try {
        var errorCode = await batteries.buyBattery(batteryID);
        res.json(errorCode);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/addBatteryType', function (req, res) {
    res.sendFile(__dirname + '/batterySetup.html');
});

app.post('/addBatteryType', async (req, res) => {
    const brand = req.body.brand;
    const price = req.body.price;
    const available = req.body.available;
    const length = req.body.length;
    const width = req.body.width;
    const height = req.body.height;
    const ampere = req.body.ampere;
    const amp = req.body.amp;
    const image = req.body.image;

    var errorCode = await batteries.addBatteryType(brand, price, available, length, width, height, ampere, amp, image);
    console.log("addBatteryType: " + errorCode);
    if (errorCode == 0)
        res.sendFile(__dirname + '/batteryTypeSuccess.html');
    else
        res.sendFile(__dirname + '/batteryTypeFail.html');
});
