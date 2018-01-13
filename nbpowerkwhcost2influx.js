'use strict';

const cheerio = require('cheerio');
const Influx = require('influx');
const request = require('request-promise');

const checkInterval = process.env.UPDATE_INTERVAL_MS || 1000 * 60 * 60 * 24;

const influxClient = new Influx.InfluxDB({
    host: process.env.INFLUX_HOST || '192.168.1.20',
    port: process.env.INFLUX_PORT || 8086,
    protocol: process.env.INFLUX_PROTOCOL || 'http',
    database: process.env.INFLUX_DB || 'nbpower',
    username: process.env.INFLUX_USER || '',
    password: process.env.INFLUX_PASS || ''
});

influxClient.createDatabase('nbpower');

let metricsRequestObj = {
    method: 'GET',
    url: 'https://www.nbpower.com/en/products-services/residential/rates',
    gzip: true,
    resolveWithFullResponse: true
};

function getNbPowerCost() {
    log(`${new Date()}: Getting NB Power Cost`);

    return request(metricsRequestObj);
}

function onGetNbPowerCost(response) {
    log(`${new Date()}: Parsing NB Power Cost`);

    var $html = cheerio.load(response.body);

    var costPerKwH = {
        cost: Number($html('tr').eq(3).find('td').eq(1).text()) / 100
    };

    writeToInflux('utility', costPerKwH).then(function() {
        console.dir(`wrote NB Power Cost data to influx: ${new Date()}`);
    });

}

function writeToInflux(seriesName, values, tags) {
    return influxClient.writeMeasurement(seriesName, [
        {
            fields: values,
            tags: tags
        }
    ]);
}

function log(message) {
    console.log(message);
}

function handleError(err) {
    log(`${new Date()}: Error`);
    log(err);
}

function restart(err) {
    if (err) {
        console.log(err);
    }

    // Every {checkInterval} seconds
    setTimeout(getCost, checkInterval);
}

function getCost() {
    getNbPowerCost()
        .then(onGetNbPowerCost)
        .catch(handleError)
        .finally(restart);
}

log(`${new Date()}: Initialize NBPowerKwHCost2Influx`);
getCost();
