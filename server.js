const Location = require('./location');
const http = require('http');
const render = require('./render.js');
const port = 3000;

const server = http.createServer((req,res) => {
    var locationInfo = req.url.replace('/','');

    if(req.url === '/')
    {
        console.log(req.url);
        res.writeHead(200, {'Content-type': "text/html"});
        render('header',{},res);
        render('search',{},res);
        render('footer',{},res);
        res.end();
    }
    else if(locationInfo.length > 0)
    {
        console.log(locationInfo);
        res.writeHead(200, {'Content-type': "text/html"});
        render('header',{},res);
        console.log(locationInfo);

        //get temperature from OpenWeatherApi
        var locWeather = new Location(locationInfo);
        locWeather.on('end', weatherInfo => {
            var data = {
                temp: weatherInfo.main.temp,
                place: weatherInfo.name
            };
            render('info',data,res);
            render('footer',{},res);
            res.end();
        })

        locWeather.on('error', error => {
            render('error',error,res);
            render('search',{},res);
            res.end();
        })
    }
});

server.listen(port);
