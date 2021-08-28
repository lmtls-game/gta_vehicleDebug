const {copyFileSync, readFileSync, writeFileSync} = require("fs");
const {parseStringPromise, Builder} = require("xml2js");

function emitResult(client, message) {
    emitNet("save-handling:result", client, message);
}

onNet("save-handling", async function (vehicleJson, handling) {
    const client = source
    const handlingAsObject = await parseStringPromise(handling);
    const vehicle = JSON.parse(vehicleJson);
    let vehicleHandlingFilePath = `${vehicle.path}/handling.meta`;
    const vehHandling = readFileSync(vehicleHandlingFilePath, "ascii");

    if (!vehHandling) {
        emitResult(client, "Could not find the original file handling.");
        return;
    }
    const vehHandlingAsObject = await parseStringPromise(vehHandling);
    const vehHandlingItem = vehHandlingAsObject.CHandlingDataMgr.HandlingData[0].Item[0];
    for (const handling in handlingAsObject.start) {
        vehHandlingItem[handling] = handlingAsObject.start[handling][0];
    }
    copyFileSync(vehicleHandlingFilePath, `${vehicleHandlingFilePath}_backup_${new Date().getTime()}_${GetPlayerName(client)}`);
    const xml = new Builder().buildObject(vehHandlingAsObject);
    SaveResourceFile(GetCurrentResourceName(), "handling.xml", xml);
    writeFileSync(vehicleHandlingFilePath, xml);
    emitResult(client, 'Handling saved, and we recommend you to copy the settings and save it locally in your machine')
});
