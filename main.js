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

var url = "http://www.amazon.cn/s/ref=s9_dnav_bw_ir11_s?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&node=658390051,!2146619051,!2146621051,1548960071,658414051&search-alias=stripbooks&field-enc-merchantbin=A1AJ19PSB66TGU&bbn=1548960071&pf_rd_m=A1AJ19PSB66TGU&pf_rd_s=merchandised-search-3&pf_rd_r=0NQ4A5HQJBC2AVHESW46&pf_rd_t=101&pf_rd_p=261616892&pf_rd_i=1548960071";
download(url, function(data) {
    if (data) {
        var $ = cheerio.load(data);
        $("a[class='a-link-normal s-access-detail-page  a-text-normal']").each(function(i, e) {
            var bookName = $(e).attr("title");
            console.log(bookName);

            var url = "http://api.douban.com/v2/book/search?q="
            + encodeURIComponent(bookName);

            var oneSecond = 500 * (i + 1); // one second = 1000 x 1 ms
            setTimeout(function() {
                request({
                    url: url,
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        if (body.books[0].rating === undefined) {
                            console.log("Get douban rating error!");
                            throw error;
                        }
                        else {
                            console.log(bookName + " : " + body.books[0].rating.average); // Print the json response
                        }
                    }
                });
            }, oneSecond);
        });

        console.log("done");
    }
    else console.log("error"); 
});
