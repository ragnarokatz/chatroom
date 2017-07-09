const fs = require("fs");
const PATH = "./data/config.json";

var config = {};

module.exports.InitConfig = function () {
    return new Promise((resolve, reject) => {
        // for file reading from disk
        var data = "";
        fs.readFile(path, (error, data) => {
            if (error) {
                var errorMsg = "Failed to read config file at path = " + PATH;
                console.log(errorMsg);
                throw new Error(errorMsg);
                reject(errorMsg);
            } else {
                console.log("Config successfully initialized!")
                config = JSON.parse(data);
                resolve();
            }
        });
    });
}

module.exports.GetConfig = function () {
    return config;
}