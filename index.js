'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var unirest = require("unirest");
let errorResposne = {
    results: []
};
var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/getMovies',function (request,response)  {
    if(request.body.queryResult.parameters['top-rated']) {
       // console.log(request.body.queryResult.parameters['top-rated']);
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/top_rated");
            req.query({
                "page": "1",
                "language": "en-US",
                "api_key": "d040a6cd3182427fd1b5e05967e143e8"
            });
            req.send("{}");
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : "Error. Can you try it again ? ",
                        "fulfillmentMessages" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.results.length > 0) {
                    let result = res.body.results;
                    let output = '';
                    for(let i = 0; i<result.length;i++) {
                        output += result[i].title;
                        output+="\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : output,
                        "fulfillmentMessages" :[{"text": {"text": [output]}}],
                        "source":""
                    })); 
                }
            });
    } else if(request.body.queryResult.parameters['movie-name']) {
     //   console.log('popular-movies param found');
        let movie = request.body.queryResult.queryText;
        var req = unirest("GET", "https://api.themoviedb.org/3/search/movie");
            req.query({
                "include_adult": "true",
                "page": "1",
                "query":movie,
                "language": "en-US",
                "api_key": "d040a6cd3182427fd1b5e05967e143e8"
            });
            req.send("{}");
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : "Error. Can you try it again ? ",
                        "fulfillmentMessages" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.results.length > 0) {
                let result = res.body.results[0];
                let output = "Average Rating : " + result.vote_average + 
                "\n Plot : " + result.overview + "url" + result.poster_path
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : output,
                        "fulfillmentMessages" :[{"text": {"text": [output]}}],
                        "source":""
                    }));
                } else {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : "Couldn't find any deatails. :( " ,
                        "fulfillmentMessages" :[{"text": {"text": ["Couldn't find any details. :(  "]}}],
                        "source":""
                    }));
                }
            });

    }  else if(request.body.queryResult.parameters['m_funds']) {
        //   console.log('popular-movies param found');
          // let movie = request.body.queryResult.queryText;
           var req = unirest("GET", "http://34.242.179.194:8080/ords/api-v2.0/mobile/rest/GetMBFunds/");
             //  req.query({
               //    "include_adult": "true",
               //    "page": "1",
               //    "query":movie,
                 //  "language": "en-US",
                  // "api_key": "d040a6cd3182427fd1b5e05967e143e8"
             // });
               req.send("{}");
               req.end(function(res) {
                   if(res.error) {
                       response.setHeader('Content-Type', 'application/json');
                       response.send(JSON.stringify({
                           "fulfillmentText" : "Error. Can you try it again ? ",
                           "fulfillmentMessages" : [{"text": {"text": [res.error]}}]
                       }));
                   }else if(res.body.result.length > 0) {
                   // let result = res.body.result[0].GetFunds;
                    let output = '';
                   // for(let i = 0; i<result.length;i++) {
                      //  output += result[i].FUND_DESCRIPTION;
                       // output+="\n"
                       output="hiiii";
                    
                   } response.setHeader('Content-Type', 'application/json');
                   response.send(JSON.stringify({
                       "fulfillmentText" : output,
                       "fulfillmentMessages" :[{"text": {"text": [output]}}],
                       "source":""
                   })); 
               })
           }
        
    
    else if(request.body.queryResult.parameters['popular-movies']) {    
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/popular");
            req.query({
                "page": "1",
                "language": "en-US",
                "api_key": "d040a6cd3182427fd1b5e05967e143e8"
            });
            req.send("{}");
            req.end(function(res){
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : "Error. Can you try it again ? ",
                        "fulfillmentMessages" : "Error. Can you try it again ? "
                    }));
                } else {
                    let result = res.body.results;
                    let output = '';
                    for(let i = 0; i < result.length;i++) {
                        output += result[i].title;
                        output += "\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : output,
                        "fulfillmentMessages" :[{"text": {"text": [output]}}],
                        "source":""
                    })); 
                }
            });
    }
});
server.get('/getName',function (req,res){
    res.send('Louisa');
});
server.listen(port, function () {
    console.log("Server is up and running...");
});