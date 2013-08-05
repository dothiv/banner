/**
 * This is the dotHIV banner control.
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')

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
        var responseText = '{"status":25,"money":"736.241","clickcount":"3.257.283","firstvisit":"center","secondvisit":"center","heading":"Vielen Dank!","subheading":"Dein Klick auf domain.hiv hat soeben einen Gegenwert von 1&thinsp;ct ausgel&ouml;st.","claim":"Wir sind Teil der Bewegung","about":"&Uuml;ber dotHIV","vote":"Vote","activated":"Bisher aktiviert:","currency":"&euro;","corresponding":"entspricht","clicks":"Klicks"}';
        ajaxCallback(responseText);
        return;

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
            // Send request.
            request.open("POST", "http://dothiv-registry.appspot.com/c?from=outside&firstvisit=" + firstVisit + "&domain=" + document.domain, true);
            request.send();
        } catch(e) {
            // Use default config if request fails
            var responseText = '{"secondvisit":"right","firstvisit":"right"}';
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
                    if (document.getElementById('dothiv-outer'))
                        document.body.removeChild(document.getElementById('dothiv-outer'));
                    if (document.getElementById('dothiv-clickcounter'))
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
                        createRightBanner(config);
                        break;
                    default:
                        createTopBanner(config);
                        break;
                }
            else
               switch(config.secondvisit) {
                     case 'top':
                         createTopBanner(config);
                         break;
                     case 'center':
                         createCenterBanner(config);
                         break;
                     default:
                         createRightBanner(config);
                         break;
    }});}

    /**
     * Inserts style rules for the iframes into the DOM.
     */
    function includeCSS() {
        var styleElement = document.createElement('style');
        var styleRules = "//@@include('../css/iframe.css')";
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
     * Supported positions are 'top', 'center' and 'right'.
     */
    function createIframeElement(position) {
        var bannerContainer = document.createElement('iframe');
        bannerContainer.id = 'dothiv-clickcounter';
        bannerContainer.className = 'dothiv-clickcounter-' + position;
        bannerContainer.src = 'banner-' + position + '.html'; //'http://dothiv-registry.appspot.com/banner-center.html';
        bannerContainer.scrolling = 'no';
        bannerContainer.frameBorder = 0;
        bannerContainer.allowTransparency = true;
        bannerContainer.setAttribute("allowtransparency", "true");
        return bannerContainer;
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
        if(navigator.appName.indexOf("Internet Explorer")!=-1 && document.compatMode!=='CSS1Compat')
            bannerContainer.style.position = 'absolute';

        outerContainer.appendChild(bannerContainer);
        outerContainer.appendChild(bannerBackground);

        document.body.insertBefore(outerContainer, document.body.firstChild);

        // Insert CSS rules
        includeCSS();

        // Register event for removing the banner when clicking on background
        document.getElementById("dothiv-background").onclick = function() {
            document.body.removeChild(document.getElementById('dothiv-outer'));
        };
    }

    /**
     * Creates the 'right' version of the banner and inserts it into the DOM.
     */
    function createRightBanner(config) {
        // Create banner iframe
        var bannerContainer = createIframeElement('right');
        document.body.insertBefore(bannerContainer, document.body.firstChild);

        // If we have to deal with IE and it's running in Quirks mode...
        if(navigator.appName.indexOf("Internet Explorer")!=-1 && document.compatMode!=='CSS1Compat') {
            bannerContainer.style.position = 'absolute';
            bannerContainer.style.bottom = '120px';
            bannerContainer.style.right = '0';
        }

        var msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1], 10);
        if (msie < 8 && document.compatMode==='CSS1Compat') {
            bannerContainer.style.bottom = '120px';
            bannerContainer.style.right = '20px';
            bannerContainer.style.display = 'block';
        } else if (msie <= 9 && document.compatMode==='CSS1Compat') {
            bannerContainer.style.bottom = '280px';
            bannerContainer.style.right = '-210px';
        }

        // Insert CSS rules
        includeCSS();

        if (msie <= 9 && document.compatMode==='CSS1Compat') {
            bannerContainer.onmouseover = function() {
                bannerContainer.style.right = '-185px';
            };
            bannerContainer.onmouseout = function() {
                bannerContainer.style.right = '-210px';
            };
        } else {
            // Register event for mouseover on iframe
            bannerContainer.onmouseover = function() {
                bannerContainer.className = 'dothiv-clickcounter-right dothiv-rb-mouseover';
            };
            bannerContainer.onmouseout = function() {
                bannerContainer.className = 'dothiv-clickcounter-right';
            };
        }
    }

    function createTopBanner(config) {
        // Create banner iframe
        var bannerContainer = createIframeElement('top');
        document.body.insertBefore(bannerContainer, document.body.firstChild);

        // Insert CSS rules
        includeCSS();

        // Register event for mouseover on iframe
        bannerContainer.onmouseover = function() {
            bannerContainer.style.height = '90px';
        };
        bannerContainer.onmouseout = function() {
            bannerContainer.style.height = '60px';
        };
    }
})();
