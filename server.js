const PORT = process.env.PORT || 9999;

let express = require('express');

let app = express();

app.use(express.static(__dirname));
app.use('/js', express.static(__dirname + '/js'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

let batteries = require("./js/newBatteries.js");

const http = require("http");

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
    res.send(batteryList);
});

app.get('/BuyBattery', function (req, res) {
    const batteryID = req.query.id;
    console.log("server:getBatteryList: ID=" + batteryID);
    var errorCode = batteries.buyBattery(batteryID);
    res.send(errorCode);
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