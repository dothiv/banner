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
            if (config.money)
                customizeBanner(config);
            else
              requestConfigAgain();
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
    // no-ajax version only
    var config = {"status":25,"money":"736.241","clickcount":"3.257.283","firstvisit":"center","secondvisit":"center","heading":"Vielen Dank!","subheading":"Dein Klick auf domain.hiv hat soeben einen Gegenwert von 1&thinsp;ct ausgel&ouml;st.","claim":"Wir sind Teil der Bewegung","about":"&Uuml;ber dotHIV","vote":"Vote","activated":"Bisher aktiviert:","currency":"&euro;","corresponding":"entspricht","clicks":"Klicks"};
    customizeBanner(config);
    return;

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
    // Send request TODO: send instead POST to correct url, use parameter to distinguish second visits
    request.open("POST", "http://dothiv-registry.appspot.com/c?firstvisit=" + firstVisit + "&domain=" + document.domain, true);
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
 *  - %VOTE%:          config.vote
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
    template = template.replace(/%VOTE%/g,config.vote);
    template = template.replace(/%ACTIVATED%/g,config.activated);
    template = template.replace(/%CURRENCY%/g,config.currency);
    template = template.replace(/%CORRESPONDING%/g,config.corresponding);
    template = template.replace(/%CLICKS%/g,config.clicks);
    template = template.replace(/%CLICKCOUNT%/g,config.clickcount);
    template = template.replace(/%MONEY%/g,config.money);
    return template;
}