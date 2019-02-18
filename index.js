'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var unirest = require("unirest");
var request = require("request");
const url_1 ="https://api.themoviedb.org/3/movie/";
const url_2="http://34.242.179.194:8080/ords/api-v2.0/mobile/rest/";
const url_3 = "https://u259.neuappx.com/ords/api-v2.0/mobile/rest/";
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
        var req = unirest("GET", url_1+"top_rated");
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

    } 
    else if (request.body.queryResult.parameters['m_funds']){

var request = unirest.get(url_2+'GetMBFunds/');
request.send({});
request.end(function(res) {
    if(res.error) {
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({
            "fulfillmentText" : res,
            "fulfillmentMessages" : [{"text": {"text": ["Error. Can you try it again ? "]}}]
        }));
    } else if(res.body.result.length > 0) {
        let result = res.body.result[0].GetFunds;
        let output = '';
        for(let i = 0; i<result.length;i++) {
            output += result[i].FUND_DESCRIPTION;
            output+=" \n "
        }
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({
            "fulfillmentText" : output,
            "fulfillmentMessages" :[{"text": {"text": [output]}}],
            "source":""
        })); 
    }
})

    }
    else if(request.body.queryResult.parameters['Get_fund_price']) {
        // console.log(request.body.queryResult.parameters['top-rated']);
         var req = unirest("GET",url_2+"GetMBFundPrice/"+request.body.queryResult.parameters.Get_fund_price+"/");
             //req.query({
               //  "page": "1",
                // "language": "en-US",
               //  "api_key": "d040a6cd3182427fd1b5e05967e143e8"
           //  });
             req.send({});
             req.end(function(res) {
                 if(res.error) {
                     response.setHeader('Content-Type', 'application/json');
                     response.send(JSON.stringify({
                         "fulfillmentText" : "Error. Can you try it again ? ",
                         "fulfillmentMessages" : [{"text": {"text": ["Error. Can you try it again ? "]}}]
                     }));
                 } 
                 else if(res.body.status == "fail") {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : "Please enter a valid Fund ID ",
                        "fulfillmentMessages" : [{"text": {"text": ["Please enter a valid Fund ID "]}}]
                    }));
                } 
                 else if(res.body.status == "success") {
                     let result = res.body.result[0].GetFundPrice;
                     let output = 'Bid Price ='+result[0].BID_PRICE + "\n Offer Price : " + result[0].OFFER_PRICE;
                     
                     response.setHeader('Content-Type', 'application/json');
                     response.send(JSON.stringify({
                         "fulfillmentText" : output,
                         "fulfillmentMessages" :[{"text": {"text": [output]}}],
                         "source":""
                     })); 
                 }

                 else  {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : "Please try again",
                        "fulfillmentMessages" :[{"text": {"text": ["Please try again"]}}],
                        "source":""
                    })); 
                }
             });
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
    res.send(JSON.stringify({ "fulfillmentText" : "output",
    "fulfillmentMessages" :[{"text": {"text": ["output"]}}],
    "source":""}));
});
server.listen(port, function () {
    console.log("Server is up and running...");
});