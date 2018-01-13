# powerpanel2influx
Pipe NB Power Price/KwH to InfluxDB

Scrapes https://www.nbpower.com/en/products-services/residential/rates and gets the current ¢/kWh

Most basic form:

    docker run -d mvantassel/nbpowerkwhcost2influx


# Configuration (ENV, -e)

Variable | Description | Default value | Sample value | Required?
-------- | ----------- | ------------- | ------------ | ---------
INFLUX_PROTOCOL | Is Influx SSL? | http | https | optional
INFLUX_HOST | Where is your InfluxDB running? | localhost | influxdb | recommended
INFLUX_PORT | What port is InfluxDB running on? | 8086 | 999 | optional
INFLUX_DB | What InfluxDB database do you want to use? | 'nbpower' | 'potato' | required
INFLUX_USER | InfluxDB username | | | optional
INFLUX_PASS | InfluxDB password | metrics | | optional
UPDATE_INTERVAL_MS | How often should it check for new metrics? | 86400000 | 1000 | optional

## Tags

- latest
