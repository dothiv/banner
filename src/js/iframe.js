/**
 * This creates the iframe to display the banner.
 */
(function () {
    // These are grunt includes
    {{include('domready.js')}}
    {{include('json2.js')}}
    {{include('helpers.js')}}

    // -------- This is the main procedure -------- //
    // Check if this is the first visit and if we can set cookies
    var firstVisit = false;
    if (!getCookie()) {
        firstVisit = setCookie() ? true : false;
    }

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
     * returns true if in development mode
     */
    function develop() {
        return '{{develop}}';
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
                request.open("GET", "demo.json", true);
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
                    iframe.contentWindow.postMessage(JSON.stringify(config), "*");
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
                createClickCounter(getOverride('position', config.firstvisit), config);
            } else {
                createClickCounter(getOverride('position', config.secondvisit), config);
            }
        });
    }

    /**
     * returns the value of the override switch
     *
     * @param name
     * @param defaultValue
     */
    function getOverride(name, defaultValue)
    {
        if (window.location.search.length < 1) {
            return defaultValue;
        }
        var q = {};
        for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
            aItKey = aCouples[nKeyId].split("=");
            q[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
        }
        var k = 'dothivclickcounter[' + name + ']';
        if (q.hasOwnProperty(k)) {
            debugLog('Override for ' + name + ' used: ' + q[k]);
            return q[k];
        }
        return defaultValue;
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
                return position;
                break;
            default:
                debugLog("Invalid position provided: " + position);
                return 'top';
        }
    }

    function createClickCounter(position, config) {
        format = getPosition(position);
        createIframeElement(position, config);
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
            var currentPos = document.getElementById('dothiv-clickcounter-iframe').className;
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
        // Rotate to the next clickcounter
        if (develop()) {
            var nextPosMap = {'top': 'right','right':'bottom', 'bottom': 'left', 'left':'premium', 'premium':'top'};
            document.location.search = '?dothivclickcounter[position]=' + nextPosMap[currentPos];
        }
    }

    function registerClickHandler()
    {
        // Register event for removing the banner when clicking on background or iframe
        document.getElementById("dothiv-clickcounter-background").onclick = close;
    }

    function isPremium(config)
    {
        return config.hasOwnProperty('premium');
    }

    /**
     * Creates the 'center' version of the banner and inserts it into the DOM.
     */
    function createCenterBanner(config) {
        var outerContainer = document.createElement('div');
        outerContainer.id = 'dothiv-outer';
        outerContainer.style.zIndex = 1;

        // Create banner iframe
        var bannerContainer = createIframeElement('center');

        // Create background HTML structure
        var bannerBackground = document.createElement('div');
        bannerBackground.id = 'dothiv-background';

        // If we have to deal with IE and it's running in Quirks mode...
        if (navigator.appName.indexOf("Internet Explorer") != -1 && document.compatMode !== 'CSS1Compat')
            bannerContainer.style.position = 'absolute';

        // Specials for IE6 standard mode
        if (isIE(6) && document.compatMode == 'CSS1Compat') {
            bannerContainer.style.position = 'absolute';
            bannerBackground.style.height = '1200px';
        }

        outerContainer.appendChild(bannerBackground);
        outerContainer.appendChild(bannerContainer);

        document.body.insertBefore(outerContainer, null);

        // Insert CSS rules
        includeCSS();

        // Register event for removing the banner when clicking on background
        document.getElementById("dothiv-background").onclick = function () {
            document.body.removeChild(document.getElementById('dothiv-outer'));
        };
    }

    /**
     * Creates the 'right' version of the banner and inserts it into the DOM.
     */
    function createRightBanner(config) {
        // Create banner iframe
        var bannerContainer = createIframeElement('right');
        document.body.insertBefore(bannerContainer, null);

        // If we have to deal with IE and it's running in Quirks mode...
        var msie = getIE();
        if (navigator.appName.indexOf("Internet Explorer") != -1 && document.compatMode !== 'CSS1Compat') {
            bannerContainer.style.position = 'absolute';
            bannerContainer.style.bottom = '120px';
            bannerContainer.style.height = '56px'; // 48 + 8
            bannerContainer.style.right = '0';
        } else if (msie <= 9 && document.compatMode === 'CSS1Compat') {
            bannerContainer.style.bottom = '240px';
            bannerContainer.style.right = '-240px';
            bannerContainer.style.height = '89px'; // 48 + 36 + 5
        }

        // Insert CSS rules
        includeCSS();

        if (navigator.appName.indexOf("Internet Explorer") != -1 && document.compatMode !== 'CSS1Compat') {
            bannerContainer.onmouseover = function () {
                bannerContainer.style.height = '84px'; // 48 + 36
            };
            bannerContainer.onmouseout = function () {
                bannerContainer.style.height = '56px'; // 48 + 8
            };
        } else if (msie <= 9 && document.compatMode === 'CSS1Compat') {
            bannerContainer.onmouseover = function () {
                bannerContainer.style.right = '-212px'; // 240px - (36 - 8)
            };
            bannerContainer.onmouseout = function () {
                bannerContainer.style.right = '-240px';
            };
        } else {
            if (!isTouchDevice()) {
                // Register event for mouseover on iframe if messaging is not supported
                if (!hasMessaging()) {
                    bannerContainer.onmouseover = function () {
                        bannerContainer.className = 'dothiv-clickcounter-right dothiv-rb-mouseover';
                    };
                    bannerContainer.onmouseout = function () {
                        bannerContainer.className = 'dothiv-clickcounter-right';
                    };
                }
            }
        }
    }

    function createTopBanner(config) {
        // Create banner iframe
        var bannerContainer = createIframeElement('top');
        document.body.insertBefore(bannerContainer, null);

        // Insert CSS rules
        includeCSS();

        // Register event for mouseover on iframe
        bannerContainer.onmouseover = function () {
            bannerContainer.style.height = '90px';
        };
        bannerContainer.onmouseout = function () {
            bannerContainer.style.height = '60px';
        };
    }
})();
