/**
 * This is the dotHIV banner control.
 */
(function() {

    @@include('domready.js')
    @@include('json2.js')

    // -------- This is the main procedure -------- //
    // Check if this is the first visit and if we can set cookies
    var firstVisit = false;
    if (!getCookie())
        firstVisit = setCookie() ? true : false;

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
        var value=escape(value);
        document.cookie='dothivstatus=returning';
        return getCookie() ? true : false;
    }

    /**
     * Sends a POST request to the server and receive banner configuration. The
     * server will be informed whether this is the first visit.
     */
    function requestConfig(firstVisit) {
        try {
            var request;
            if (window.XDomainRequest) {
                request = new XDomainRequest();
                request.onload = function() { ajaxCallback(request.responseText); };
                request.onprogress = function() {};
            } else {
                request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) 
                        ajaxCallback(request.responseText);
                }
            }
            // Send request. TODO: send instead POST to correct url
            request.open("POST", "http://dothiv-registry.appspot.com/c?firstvisit=" + firstVisit + "&domain=" + document.domain, true);
            request.send();
        } catch(e) {
            var responseText = '{"secondvisit":"top","firstvisit":"top"}';
            ajaxCallback(responseText);
        }
    }

    /**
     * Callback function for handling config data and moving on.
     */
    function ajaxCallback(responseText) {
        var config = JSON.parse(responseText);
        if (!!window.postMessage)
            registerMessageHandling(config);
        manipulateDOM(config);
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
        eventer(messageEvent, function(e) {
            switch (e.data) {
                case 'get config':
                    document.getElementById('dothiv-clickcounter').contentWindow.postMessage(JSON.stringify(config), "*");
                    break;
                case 'remove':
                    document.body.removeChild(document.getElementById('dothiv-clickcounter'));
                    if (document.getElementById('dothiv-background')) 
                        document.body.removeChild(document.getElementById('dothiv-background'));
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
            if (firstVisit || (config.secondvisit != 'top' && config.secondvisit != 'right' && config.secondvisit != 'center'))
                switch(config.firstvisit) {
                    case 'center':
                        createCenterBanner(config);
                        break;
                    case 'right':
                        //createRightBanner(config);
                        break;
                    default:
                        //createTopBanner(config);
                        break;
                }
            else
               switch(config.secondvisit) {
                     case 'top':
                         //createTopBanner(config);
                         break;
                     case 'center':
                        createCenterBanner(config);
                        break;
                     default:
                         //createRightBanner(config);
                         break;
                }
        });
    }

    /**
     * Creates the 'center' version of the banner and inserts it into the DOM.
     */
    function createCenterBanner(config) {
        // Create banner iframe
        var bannerContainer = document.createElement('iframe');
        bannerContainer.id = 'dothiv-clickcounter';
        bannerContainer.src = 'http://dothiv-registry.appspot.com/banner-center.html';
        bannerContainer.scrolling = 'no';
        bannerContainer.frameBorder = 0;
        bannerContainer.allowTransparency = true;
        bannerContainer.setAttribute("allowtransparency", "true");
        document.body.insertBefore(bannerContainer, document.body.firstChild);

        // Create background HTML structure
        var bannerBackground = document.createElement('div');
        bannerBackground.id = 'dothiv-background';
        document.body.insertBefore(bannerBackground, document.body.firstChild);

        // Include styles for banner
        var styleElement = document.createElement('style');
        var styleRules = "@@include('../css/iframe.css')";
        styleElement.type = 'text/css';
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = styleRules;
        } else {
           var textNode = document.createTextNode(styleRules);
            styleElement.appendChild(textNode);
        }
        document.getElementsByTagName('head')[0].appendChild(styleElement);

        // Register event for removing the banner when clicking on background
        document.getElementById("dothiv-background").onclick = function() {
            document.body.removeChild(document.getElementById('dothiv-clickcounter'));
            document.body.removeChild(document.getElementById('dothiv-background'));
        };
    }
})();
