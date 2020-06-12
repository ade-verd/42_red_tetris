export const decodeHtmlEntity = str => {
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
};

export const encodeHtmlEntity = function(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
};

// Source : https://gist.github.com/CatTail/4174511
