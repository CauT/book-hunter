var http = require("http");
var request = require("request")
var cheerio = require("cheerio");
var fs = require('fs');

console.log("Begining to search");

// it should be read from a json in the end
// var config = {
//     nameId: ,
//     pageUrlHead: ,
//     pageUrlTail: ,
//     rankUrlHead: ,
//     rankUrlTail: ,
// }

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
    http.get(url, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
        callback(null);
    });
}

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

for (var j=1; j<=config.pageNum; j++) {
    var url = config.pageUrlHead + j + config.pageUrlTail;
    download(url, function(data) {
    if (data) {
        var $ = cheerio.load(data);
        $(config.DomBookNameSearchExpr).each(function(i, e) {
            var bookName = $(e).attr("title");

            var rankUrl = config.rankUrlHead + encodeURIComponent(bookName)
            + config.rankUrlTail;
            request({
                url: rankUrl,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    if (body !== undefined
                        && body.books !== undefined
                        && body.books[0] !== undefined) {
                        var aver = parseInt(body.books[0].rating.average);
                        if (aver >= 7.5)
                            console.log(bookName + " : " + body.books[0].rating.average); // Print the json response
                    }
                }
            });
        });
    }
    else console.log("error"); 
});
}
