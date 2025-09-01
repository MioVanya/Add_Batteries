const URL_GET_BATTERY_LIST = "/getBatteryList";

const OK = 0;
const ERROR_NO_SUCH_BATTERY = -1;
const ERROR_OUT_OF_STOCK = -2;

const URL_BUY_BATTERY = "/BuyBattery";

init = function () {
    console.log("Client: Initialising");
}

buyBattery = function (batteryID, batteryMarka) {
    let url = URL_BUY_BATTERY + "?id=" + batteryID;
    fetch(url).then(function (response) {
            return response.json();
        })
        .then(function (errorCode) {
            displayErrorMessage(errorCode);
            getBatteryList(batteryMarka);
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

getBatteryList = function (marka) {
    let url = URL_GET_BATTERY_LIST + "?marka=" + marka;
    console.log("getBatteryList: " + url);
    fetch(url).then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayBatteryList(data);
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

displayBatteryList = function (batteryData) {
    var newRow, newCell;
    var batteryTable = document.getElementById("batteryTable");
    batteryTable.innerHTML = "";


    if (batteryData.length > 0 && batteryData[0].image) {
        const img = document.createElement("img");
        img.src = batteryData[0].image;
        img.alt = batteryData[0].marka;
        img.width = 200;
        img.style.display = "block";
        img.style.margin = "0 auto 20px";
        batteryTable.appendChild(img);
    }


    const table = document.createElement("table");
    table.classList.add("battery-table");

    addHeaderData(batteryTable);

    for (var i = 0; i < batteryData.length; i++) {
        newRow = batteryTable.insertRow();

        newCell = newRow.insertCell();
        newCell.innerHTML = batteryData[i].marka;
        newCell = newRow.insertCell();
        newCell.innerHTML = batteryData[i].amper;
        newCell = newRow.insertCell();
        newCell.innerHTML = batteryData[i].amp;
        newCell = newRow.insertCell();
        newCell.innerHTML = batteryData[i].length + "x" + batteryData[i].width + "x" + batteryData[i].height;
        newCell = newRow.insertCell();
        newCell.innerHTML = batteryData[i].available;
        newCell = newRow.insertCell();
        newCell.innerHTML = batteryData[i].price;
        newCell = newRow.insertCell();
        newCell.innerHTML = '<button onclick="buyBattery(' + batteryData[i].id + ', \'' + batteryData[i].marka + '\')">Buy</button>';
    }
}

function displayResults(batteries, lang) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!batteries.length) {
        resultsDiv.innerHTML = translations[lang].noResults;
        return;
    }


    if (batteries.length > 0 && batteries[0].image) {
        const img = document.createElement("img");
        img.src = batteries[0].image;
        img.alt = batteries[0].marka;
        img.width = 200;
        img.style.display = "block";
        img.style.margin = "0 auto 20px";
        resultsDiv.appendChild(img);
    }

    const table = document.createElement("table");
    table.classList.add("battery-table");

    const header = table.insertRow();
    translations[lang].tableHeaders.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
    });

    batteries.forEach(b => {
        const row = table.insertRow();
        row.insertCell().textContent = b.marka;
        row.insertCell().textContent = b.amper;
        row.insertCell().textContent = b.amp;
        row.insertCell().textContent = `${b.length}x${b.width}x${b.height}`;
        row.insertCell().textContent = b.available;
        row.insertCell().textContent = b.price;

        const buyCell = row.insertCell();
        const btn = document.createElement("button");

        btn.textContent = translations[lang].buyButton;
        btn.onclick = () => buyBattery(b.id, b.marka);
        buyCell.appendChild(btn);
    });

    resultsDiv.appendChild(table);
}

addHeaderData = function (batteryTable) {
    var newRow, newCell;
    newRow = batteryTable.insertRow();
    newCell = newRow.insertCell();
    newCell.innerHTML = "Marka";
    newCell = newRow.insertCell();
    newCell.innerHTML = "Amper";
    newCell = newRow.insertCell();
    newCell.innerHTML = "Amp";
    newCell = newRow.insertCell();
    newCell.innerHTML = "Size";
    newCell = newRow.insertCell();
    newCell.innerHTML = "Available";
    newCell = newRow.insertCell();
    newCell.innerHTML = "Price";
}

displayData = function (text) {
    document.getElementById('batteryData').innerHTML = text;
}

displayErrorMessage = function (errorCode) {
    var errorMessage = "Battery purchased";
    if (errorCode == ERROR_NO_SUCH_BATTERY)
        errorMessage = "Unknown battery";
    if (errorCode == ERROR_OUT_OF_STOCK)
        errorMessage = "Out of Stock";
    document.getElementById('errorMessage').innerHTML = errorMessage;
}
