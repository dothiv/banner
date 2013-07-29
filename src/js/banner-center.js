/**
 * Control for center banner
 */
(function() {

    @@include('domready.js')

    domready(function () {
        if (window.JSON) { // Prepare for messaging and request banner configuration, if browser is capable (>=IE8)
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
            eventer(messageEvent, function(e) {
                customizeBanner(JSON.parse(e.data));
            }, false);

            window.parent.postMessage("get config","*");
        } else { // Request config again
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
            // Send request TODO: send instead POST to correct url
            //request.open("GET", "/data.json?firstvisit=" + firstVisit, true);
            //request.send();

            // no-ajax version only
            var config = {status: 45,money: '736.241',clickcount: '3.257.283',firstvisit: 'center',secondvisit: 'center',heading: 'Vielen Dank!',subheading: 'Dein Klick auf domain.hiv hat soeben einen Gegenwert von 1&thinsp;ct ausgel&ouml;st.',claim: 'Wir sind Teil der Bewegung',about: '&Uuml;ber dotHIV',vote: 'Vote',activated: 'Bisher aktiviert:',currency: '&euro;',corresponding: 'entspricht',clicks: 'Klicks'};
            customizeBanner(config);
        }
    });

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
        if (window.JSON)
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