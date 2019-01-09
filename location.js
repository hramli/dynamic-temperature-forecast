const EventEmitter = require('events').EventEmitter;
const https = require('https');
const util = require('util');

util.inherits(Location, EventEmitter);

function Location(locationInfo){
    EventEmitter.call(this);
    var loc = this;
    
    try { //for errors such as invalid url
        const request = https.get(`https://api.openweathermap.org/data/2.5/weather?APPID=449605309b7cc1c4dab96ca2b913cf15&q=${locationInfo}`,
        response => {
            
            try {
                var responseBody = "";
                response.on('data', chunk => {
                    responseBody += chunk;
                    loc.emit('data', chunk);
                })
                response.on('end', () => {
                    var weatherInfo = JSON.parse(responseBody);
                    if(response.statusCode == 200) {
                        loc.emit('end', weatherInfo);
                    } 
                    else {
                        var error = {
                            message: weatherInfo.message
                        }
                        loc.emit('error', error);
                    }
                })
            } catch (error) {
                
                loc.emit('error',error);
            }
    
        }).on('error', error => {
            loc.emit('error', error);
        })
    } catch (error) {
        loc.emit('error',error);
    }
}

module.exports = Location;