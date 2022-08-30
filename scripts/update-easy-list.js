const https = require("https");
const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  `../packages/main/public/data/easylist.txt`
);
const easylistOptions = {
  hostname: "easylist.to",
  port: 443,
  path: "/easylist/easylist.txt",
  method: "GET",
};

const easyprivacyOptions = {
  hostname: "easylist.to",
  port: 443,
  path: "/easylist/easyprivacy.txt",
  method: "GET",
};

function makeRequest(options, callback) {
  var request = https.request(options, function (response) {
    response.setEncoding("utf8");

    var data = "";
    response.on("data", function (chunk) {
      data += chunk;
    });

    response.on("end", function () {
      callback(data);
    });
  });
  request.end();
}

/* get the filter lists */

makeRequest(easylistOptions, function (easylist) {
  makeRequest(easyprivacyOptions, function (easyprivacy) {
    var data = easylist + easyprivacy;

    data = data
      .split("\n")
      .filter(function (line) {
        return !line.trim().startsWith("!"); // comments
      })
      .join("\n");

    fs.writeFileSync(filePath, data);
  });
});
