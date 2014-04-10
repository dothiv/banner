/**
 * This file contains javascript code and functions that are used by all three
 * banner variants.
 */

var animateBannerHandle;

domready(function () {
    if (!!window.postMessage) { // Prepare for messaging and request banner configuration, if browser is capable (>=IE8)
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function(e) {
            var config = JSON.parse(e.data)
            if (!(config.money == undefined)) {
                // @ifdef DEBUG
                // This method animates the banner to show all possible values from 0 to 100
                config.status = 0;
                animateBannerHandle = window.setInterval(function() {
                    config.status = (config.status + 1);
                    if (config.status > 100) {
                        config.status = parseInt(Math.random() * 100);
                        window.clearInterval(animateBannerHandle);
                    }
                    customizeBanner(config);
                }, 15);
                // @endif
                customizeBanner(config);
            } else {
              requestConfigAgain();
            }
        }, false);

        window.parent.postMessage("get config","*");
    } else {
        requestConfigAgain();
    }
});

/**
 * Requests the config object using AJAX.
 */
function requestConfigAgain() {
    // Create new request
    var request;
    if (window.XMLHttpRequest)
        request = new XMLHttpRequest();
    else
      request = new ActiveXObject("Microsoft.XMLHTTP");

    // Define callback function
    request.onreadystatechange=function() {
        if (request.readyState==4 && request.status==200) {
            var config = (eval("(function(){return " + request.responseText + ";})()"));
            customizeBanner(config);
        }
    }
    // Send request
    // @ifdef DEBUG
    request.open("GET", "demo.json", true);
    // @endif
    // @ifndef DEBUG
    request.open("POST", "https://dothiv-registry.appspot.com/c?from=iframe&domain=" + document.domain, true);
    // @endif
    request.send();
}

/**
 * Parse the given template. 
 *
 * Supported placeholders are:
 *  - %HEADING%:       config.heading
 *  - %SUBHEADING%:    config.subheading
 *  - %CLAIM%:         config.claim
 *  - %ABOUT%:         config.about
 *  - %ACTIVATED%:     config.activated
 *  - %CURRENCY%:      config.currency
 *  - %CORRESPONDING%: config.corresponding
 *  - %CLICKS%:        config.clicks
 *  - %CLICKCOUNT%:    config.clickcount
 *  - %MONEY%:         config.money
 */
function parse(template, config) {
    template = template.replace(/%HEADING%/g,config.heading);
    template = template.replace(/%SUBHEADING%/g,config.subheading);
    template = template.replace(/%CLAIM%/g,config.claim);
    template = template.replace(/%ABOUT%/g,config.about);
    template = template.replace(/%ACTIVATED%/g,config.activated);
    template = template.replace(/%CURRENCY%/g,config.currency);
    template = template.replace(/%CORRESPONDING%/g,config.corresponding);
    template = template.replace(/%CLICKS%/g,config.clicks);
    template = template.replace(/%CLICKCOUNT%/g,config.clickcount);
    template = template.replace(/%MONEY%/g,config.money);
    return template;
}

/**
 * Determines whether the pink bar needs to be rendered in short version.
 */
function isShortBar(config) {
    return config.status < 50;
}

/**
 * Check of we are on a touch device.
 *
 * @see http://stackoverflow.com/a/4819886
 * @returns {boolean}
 */
function isTouchDevice() {
    return 'ontouchstart' in window // works on most browsers
        || 'onmsgesturechange' in window; // works on ie10
}
