const fs = require("fs");
const PATH = "./data/config.json";

var config = {};

module.exports.InitConfig = function () {
    return new Promise((resolve, reject) => {
        // for file reading from disk
        var data = "";
        fs.readFile(PATH, (error, data) => {
            if (error) {
                console.log(error);
                throw new Error(error);
                reject(error);
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