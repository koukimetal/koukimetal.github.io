var getUrlParameter = function() {
    var queries = decodeURIComponent(window.location.search.substring(1));
    var keyValues = queries.split('&');
    var res = {};
    for (var i = 0; i < keyValues.length; i++) {
        var kv = keyValues[i].split('=');
        res[kv[0]] = kv[1];
    }
    return res;
};