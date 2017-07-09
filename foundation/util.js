// util.js

// is string within valid size
module.exports.IsStringValidSize = function(str, min, max)
{
    return str.length < min ? false : str.length > max ? false : true;
}

// is string within the valid regular expression
module.exports.IsStringValidExp = function(str, regExp)
{
    return str.match(regExp);
}

// is element in array
module.exports.IsInArray = function(element, arr)
{
    return arr.indexOf(element) != -1;
}

module.exports.IsEmptyObject = function(obj)
{
    return JSON.stringify(obj) === JSON.stringify({});
}