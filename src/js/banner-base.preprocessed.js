/**
 * This file contains javascript code and functions that are used by all three
 * banner variants.
 */

domready(function () {
    if (!!window.postMessage) { // Prepare for messaging and request banner configuration, if browser is capable (>=IE8)
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function(e) {
            var config = JSON.parse(e.data)
            if (!(config.money == undefined)) {
                // @ifdef DEBUG
                config.percent = Math.random();
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
 *  - %ABOUT%:         config.about
 *  - %ACTIVATED%:     config.activated
 *  - %CLICKCOUNT%:    config.clickcount
 *  - %MONEY%:         config.money
 */
function parse(template, config) {
    // @ifndef DEBUG
    // Test-Mode.
    // FIXME: Use regular heading when out of test mode. Remove next line.
    config.heading = '<a href="https://dothiv.github.io/banner/" target="_blank" style="text-decoration: none;"><abbr title="We are currently testing the click counters. So every number you see on the counter is not real but test data.">TEST!</abbr></a>';
    // @endif
    template = template.replace(/%HEADING%/g,config.heading);
    template = template.replace(/%SUBHEADING%/g,config.subheading);
    template = template.replace(/%ABOUT%/g,config.about);
    template = template.replace(/%ACTIVATED%/g,config.activated);
    template = template.replace(/%CLICKCOUNT%/g,config.clickcount);
    template = template.replace(/%MONEY%/g,config.money);
    return template;
}

/**
 * Determines whether the pink bar needs to be rendered in short version.
 * FIXME: Rename.
 */
function isShortBar(config) {
    return config.percent < 0.5;
}
