var http = require("http");
var request = require("request")
var cheerio = require("cheerio");

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

var urlHead = "http://www.amazon.cn/s/ref=sr_pg_2?rh=n%3A658390051%2Cn%3A%212146619051%2Cn%3A%212146621051%2Cn%3A1548960071%2Cn%3A658414051%2Cp_6%3AA1AJ19PSB66TGU&page=";
var urlTail = "&bbn=1548960071&ie=UTF8&qid=1447074469";
for (var j=1; j<=75; j++) {
    var oneSecond = 100 * j; // one second = 1000 x 1 ms
    setTimeout(function() {
        var url = urlHead + j.toString() + urlTail;
        download(url, function(data) {
            if (data) {
                var $ = cheerio.load(data);
                // console.log(x-1);
                // console.log('=================================================================');
                $("a[class='a-link-normal s-access-detail-page  a-text-normal']").each(function(i, e) {
                    setTimeout(function() {
                        var bookName = $(e).attr("title");

                        var url = "http://api.douban.com/v2/book/search?q="
                        + encodeURIComponent(bookName);
                        request({
                            url: url,
                            json: true
                        }, function (error, response, body) {
                            if (!error && response.statusCode === 200) {
                                if (body !== undefined
                                    && body.books !== undefined
                                    && body.books[0] !== undefined) {
                                    // console.log(bookName + " : " + "Get douban rating error!");
                                // }
                                // else {
                                    var aver = parseInt(body.books[0].rating.average);
                                    if (aver >= 7.5)
                                        console.log(bookName + " : " + body.books[0].rating.average); // Print the json response
                                }
                            }
                        });
                    }, oneSecond);
                });
            }
            else console.log("error"); 
        });
    }, oneSecond);
}
