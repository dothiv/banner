/**
 * returns true if in development mode
 */
function develop() {
    return '{{develop}}' == '1';
}

/**
 * Logs msg to the console of in development mode and console is available.
 *
 * @param msg
 */
function debugLog(msg) {
    if (!develop()) {
        return;
    }
    window.console && console.log(msg);
}

// Override
var Override = function Override() {
    this.prefix = 'dothivclickcounter';
    this.props = {
        'position': null,
        'reload': false,
        'rotate': false,
        'config': null
    };
    if (window.location.search.length < 1) {
        return;
    }
    var q = {};
    for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
        aItKey = aCouples[nKeyId].split("=");
        q[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
    }

    for (var k in this.props) {
        var n = this.prefix + '[' + k + ']';
        if (q.hasOwnProperty(n)) {
            debugLog('Override for ' + k + ' used: ' + q[n]);
            this.props[k] = q[n];
        }
    }
};
Override.prototype.get = function (name, defaultValue) {
    if (!this.props.hasOwnProperty(name)) {
        return defaultValue;
    }
    var o = this.props[name];
    return o == null ? defaultValue : o;
};
Override.prototype.set = function (name, value) {
    if (!this.props.hasOwnProperty(name)) {
        return defaultValue;
    }
    this.props[name] = value;
};
Override.prototype.getQuery = function () {
    var s = '';
    for (var k in this.props) {
        s += (s.length == 0 ? '?' : '&') + this.prefix + '[' + k + ']=' + encodeURIComponent(this.props[k]);
    }
    return s;
};
Override.prototype.overrideConfig = function(config)
{
    for(var n in config) {
        if (!config.hasOwnProperty(n)) {
            continue;
        }
        if (!this.props.hasOwnProperty(n)) {
            continue;
        }
        config[n] = this.props[n];
    }
    return config;
};
