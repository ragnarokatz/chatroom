// util.js

module.exports.TryParseJson = function (json) {
    return new Promise((resolve, reject) => {
        try {
            var obj = JSON.parse(json);
            resolve(obj);
        } catch (exception) {
            var error = "Exception caught when parsing json: " + exception;
            reject(error);
        }
    });
}

// is string within valid size
module.exports.IsStringValidSize = function (str, min, max) {
    return str.length < min ? false : str.length > max ? false : true;
}

// is string within the valid regular expression
module.exports.IsStringValidExp = function (str, regExp) {
    return str.match(regExp);
}

// is element in array
module.exports.IsInArray = function (element, arr) {
    return arr.indexOf(element) != -1;
}

module.exports.IsEmptyObject = function (obj) {
    return JSON.stringify(obj) === JSON.stringify({});
}