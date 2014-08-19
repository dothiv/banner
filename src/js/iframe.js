/**
 * This creates the iframe to display the banner.
 */
(function () {
    // These are grunt includes
    {{include('iframe/domready.js')}}
    {{include('iframe/develop.js')}}
    {{include('iframe/helpers.js')}}

    // -------- This is the main procedure -------- //
    // Check if this is the first visit and if we can set cookies
    var firstVisit = false;
    if (!getCookie()) {
        firstVisit = setCookie() ? true : false;
    }

    // Init overrides
    var override = new Override();

    // Fetch banner configuration from dotHIV server and add banner to DOM
    requestConfig(firstVisit);
    // -------- End of main procedure -------- //

    /**
     * Gets the dothiv status cookie and returns its value. If the cookie
     * cannot be found, 'null' is returned.
     */
    function getCookie() {
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++)
            if (cookieArray[i] == 'dothivstatus=returning')
                return true;
        return false;
    }

    /**
     * Set a cookie to be able to distinguish new visitors from those who have
     * already seen the banner. Returns 'true' on success and 'false' otherwise.
     */
    function setCookie() {
        document.cookie = 'dothivstatus=returning';
        return getCookie() ? true : false;
    }

    /**
     * Sends a POST request to the server and receive banner configuration.
     */
    function requestConfig() {
        try {
            var request;
            if (window.XDomainRequest) {
                request = new XDomainRequest();
                request.onload = function () {
                    ajaxCallback(request.responseText);
                };
                request.onprogress = function () {
                };
            } else {
                request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == 200)
                        ajaxCallback(request.responseText);
                }
            }
            // Send request.
            if (develop()) {
                request.open("GET", override.get('config', 'demo.json'), true);
            } else {
                var pt = getPreviousVisit();
                var ct = Date.now();
                setPreviousVisit(ct);
                request.open("POST", "https://dothiv-registry.appspot.com/c?from=outside&domain=" + document.domain + '&pt=' + pt + '&ct=' + ct, true);
            }
            request.send();
        } catch (e) {
            // Use default config if request fails
            var responseText = '{"secondvisit":"top","firstvisit":"top"}';
            ajaxCallback(responseText);
        }
    }

    /**
     * Saves time t as time last visited in a cookie.
     *
     * @param t
     */
    function setPreviousVisit(t) {
        var lifetime = 2592000;
        var d = new Date();
        var expires = d.setTime(d.getTime() + lifetime * 1000);
        document.cookie = "dothivpt=" + t + ";path=/;max-age=" + lifetime + ";expires=" + d.toGMTString() + ";";
    }

    /**
     * Returns the timestamp in milliseconds of the previous visit (as stored in a cookie) or an empty string.
     *
     * @return ''|int
     */
    function getPreviousVisit() {
        var pt = '';
        var ptmatch = document.cookie.match('dothivpt=([0-9]{13})');
        if (ptmatch) {
            pt = ptmatch[1];
        }
        return pt;
    }

    /**
     * Callback function for handling config data and moving on.
     */
    function ajaxCallback(responseText) {
        var config = JSON.parse(responseText);
        if (hasMessaging()) {
            registerMessageHandling(config);
        }
        manipulateDOM(config);
    }

    /**
     * Returns whether window.postMessage is supported in this browser.
     *
     * @returns {boolean}
     */
    function hasMessaging() {
        return !!window.postMessage;
    }

    /**
     * Register message handling. Supported messages are:
     *
     *  - 'get config': config object requested, send it back
     *  - 'remove':     iframe removal requested, delete it from DOM
     */
    function registerMessageHandling(config) {
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function (e) {
            var iframe = document.getElementById('dothiv-clickcounter-iframe');
            debugLog('Message received: ' + e.data);
            switch (e.data) {
                case 'get config':
                    if (develop()) {
                        iframe.contentWindow.postMessage(JSON.stringify(override.overrideConfig(config)), "*");
                    } else {
                        iframe.contentWindow.postMessage(JSON.stringify(config), "*");
                    }
                    break;
                case 'remove':
                    close();
                    break;
            }
        }, false);
    }

    /**
     * Manipulate the DOM by inserting dotHIV banner and css code. This will be
     * done once the DOM is ready.
     */
    function manipulateDOM(config) {
        domready(function () {
            // Determine which of the three banner versions to render
            if (firstVisit) {
                createClickCounter(override.get('position', config.firstvisit), config);
            } else {
                createClickCounter(override.get('position', config.secondvisit), config);
            }
        });
    }

    /**
     * Validates the position
     *
     * @param position
     * @returns string
     */
    function getPosition(position) {
        switch (position) {
            case 'top':
            case 'bottom':
            case 'left':
            case 'right':
            case 'premium':
            case 'topleft-micro':
            case 'topright-micro':
            case 'top-micro':
            case 'invisible':
                return position;
                break;
            default:
                debugLog("Invalid position provided: " + position);
                return 'top';
        }
    }

    function createClickCounter(position, config) {
        var format = getPosition(position);
        if (format == 'invisible') {
            debugLog("Nothing to do, invisible counter.");
            return;
        }
        createIframeElement(format, config);
        includeCSS();
        registerClickHandler();
    }

    /**
     * Inserts style rules for the iframes into the DOM.
     */
    function includeCSS() {
        var styleElement = document.createElement('style');
        var styleRules = "{{include('../css/iframe.min.css')}}";
        styleElement.type = 'text/css';
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = styleRules;
        } else {
            var textNode = document.createTextNode(styleRules);
            styleElement.appendChild(textNode);
        }
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    /**
     * Returns an iframe DOM element configured for the given position.
     */
    function createIframeElement(position, config) {
        debugLog("Creating iframe: " + position);
        var iframe = document.createElement('iframe');
        iframe.id = 'dothiv-clickcounter-iframe';
        iframe.className = position;
        if (develop()) {
            iframe.src = '../build/clickcounter-' + position + '.html?' + Date.now();
        } else {
            iframe.src = 'https://dothiv-registry.appspot.com/static/clickcounter-' + position + '.html';
        }
        iframe.scrolling = 'no';
        iframe.frameBorder = 0;
        iframe.allowTransparency = true;
        iframe.setAttribute("allowtransparency", "true");

        var background = document.createElement('div');
        background.id = 'dothiv-clickcounter-background';
        background.className = position;

        if (isPremium(config)) {
            background.style.backgroundColor = config.barColor;
        }

        var container = document.createElement('div');
        container.id = 'dothiv-clickcounter-outer';
        container.style.zIndex = 1;

        container.appendChild(background);
        container.appendChild(iframe);

        document.body.insertBefore(container, null);
    }

    /**
     * Remove all clickcounter elements
     */
    function close() {
        if (develop()) {
            if (override.get('reload', false) == '1') {
                var currentPos = document.getElementById('dothiv-clickcounter-iframe').className;
            }
        }
        if (document.getElementById('dothiv-clickcounter-outer')) {
            document.body.removeChild(document.getElementById('dothiv-clickcounter-outer'));
        }
        if (document.getElementById('dothiv-clickcounter-iframe')) {
            document.body.removeChild(document.getElementById('dothiv-clickcounter-iframe'));
        }
        if (document.getElementById('dothiv-clickcounter-background')) {
            document.body.removeChild(document.getElementById('dothiv-clickcounter-background'));
        }

        if (develop()) {
            // Rotate to the next clickcounter
            if (override.get('reload', false) == '1') {
                var nextPosMap = {
                    'top': 'right', 'right': 'bottom', 'bottom': 'left', 'left': 'premium',
                    'premium': 'topleft-micro',
                    'topleft-micro': 'top-micro', 'top-micro': 'topright-micro', 'topright-micro': 'top'};
                var rotate = override.get('rotate', false);
                override.set('position', rotate == '1' ? nextPosMap[currentPos] : currentPos);
                document.location.search = override.getQuery();
            }
        }
    }

    function registerClickHandler() {
        // Register event for removing the banner when clicking on background or iframe
        document.getElementById("dothiv-clickcounter-background").onclick = function() {
            if (develop()) {
                override.set('reload', 0);
            }
            close();
        };
    }

    function isPremium(config) {
        return config.hasOwnProperty('premium') && config.premium;
    }
})();
