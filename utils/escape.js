"use strict";
const escapeChars = {
    "&": "&amp;",
    "'": "&#39;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;"
};

const escapeString = function(str) {
    for (const key in escapeChars) {
        const reg = new RegExp(key, "g");
        str = str.replace(reg, escapeChars[key]);
    }
    return str;
};

const escapeObj = function(obj) {
    for (const key in obj) {
        if ("string" === typeof obj[key]) {
            obj[key] = escapeString(obj[key]);
        } else {
            escapeObj(obj[key]);
        }
    }
    return obj;
};
const unescapeString = function(string) {
    return string.replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
};
/*let a = `'"<>&'"<>&'"<>&`
console.log(escapeString(a));
console.log(unescapeString(escapeString(a)));*/

module.exports = {
    escapeObj,
    unescapeString,
    escapeString
};