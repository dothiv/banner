/**
 * Control for center banner
 */
(function() {

    @@include('domready.js')
    @@include('json2.js')

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
        // Send request TODO: send instead POST to correct url, use parameter to distinguish second visits
        request.open("POST", "http://dothiv-registry.appspot.com/c?firstvisit=" + firstVisit + "&domain=" + document.domain, true);
        request.send();
    }

    /**
     * Creates the 'center' version of the banner.
     */
    function customizeBanner(config) {
        // Parse template
        document.body.innerHTML = parse(document.body.innerHTML, config);

        // Determine whether the status bar is short
        var shortBar = config.status < 20;

        // Configure pink status bar
        document.getElementById("dothiv-cb-pinkbar").style.width = config.status + '%';
        if (shortBar)
            document.getElementById("dothiv-cb-status-left").style.display = 'none';
        else
           document.getElementById("dothiv-cb-status-right").style.display = 'none';

        // Register events for pink bar
        document.getElementById("dothiv-cb-statusbar").onmouseover = function(){showClicks(shortBar);};
        document.getElementById("dothiv-cb-statusbar").onmouseout = function(){showMoney(shortBar);};

        // Register events for removing the banner, if supported by browser
        if (!!window.postMessage)
            document.getElementById("dothiv-cb-close").onclick = function() {window.parent.postMessage("remove","*");};
        else
           document.getElementById("dothiv-cb-close").style.display = 'none';
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

    /**
     * Show the secondary information layer on pink bar, indicating the number 
     * of clicks so far. The argument indicates whether the pink bar is short.
     */
    function showClicks(shortBar) {
        if (shortBar) {
            document.getElementById("dothiv-cb-status-right").style.display = 'none';
            document.getElementById("dothiv-cb-status-right-secondary").style.display = 'inline-block';
        } else {
            document.getElementById("dothiv-cb-status-left").style.display = 'none';
            document.getElementById("dothiv-cb-status-left-secondary").style.display = 'block';
        }
    }

    /**
     * Show the primary information layer on pink bar, indicating the activated
     * money. The argument indicates whether the pink bar is short.
     */
    function showMoney(shortBar) {
        if (shortBar) {
            document.getElementById("dothiv-cb-status-right").style.display = 'inline-block';
            document.getElementById("dothiv-cb-status-right-secondary").style.display = 'none';
        } else {
            document.getElementById("dothiv-cb-status-left").style.display = 'block';
            document.getElementById("dothiv-cb-status-left-secondary").style.display = 'none';
        }
    }
})();