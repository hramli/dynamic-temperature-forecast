const Location = require('./location');
const http = require('http');
const render = require('./render.js');
const querystring = require('querystring');
const port = 3000;

const server = http.createServer((req,res) => {
    var locationInfo = req.url.replace('/','');

    //HTTP route GET / and POST /
    if(req.url === '/')
    {
        //if GET
        if(req.method.toUpperCase() === 'GET')
        {
            res.writeHead(200, {'Content-type': "text/html"});
            render('header',{},res);
            render('search',{},res);
            render('footer',{},res);
            res.end();
        }
        //if POST, redirect to /:location
        else
        {
            req.on('data', body => {
                var postLocation = querystring.parse(body.toString()).location;
                res.writeHead(303, {"Location": "/"+postLocation});
                res.end();
            })
        }
    }

    //if request is GET /:location, i.e. /seattle
    else if(locationInfo.length > 0)
    {
        res.writeHead(200, {'Content-type': "text/html"});
        render('header',{},res);
        
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
