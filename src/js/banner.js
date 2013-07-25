/**
 * This is the dotHIV banner control.
 *
 * Contact: http://dothiv.org
 */

(function() {

    @@include('domready.js')
    @@include('banner-center.js')
    @@include('banner-right.js')
    @@include('banner-top.js')

    // -------- This is the main procedure -------- //
    // Check if we have to deal with Internet Explorer 8 or earlier
    var msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1], 10);

    // Make custom tags available for Internet Explorer
    if (msie <= 8)
        registerCustomTags();

    // Check if this is the first visit and if we can set cookies
    var firstVisit = false;
    if (!getCookie())
        firstVisit = setCookie() ? true : false;

    // Fetch banner configuration from dotHIV server and add banner to DOM
    requestConfig(firstVisit);
    // -------- End of main procedure -------- //

    /**
     * Register custom tags (necessary for IE8 and below).
     */
    function registerCustomTags() {
        document.createElement('dothiv:div');
        document.createElement('dothiv:span');
        document.createElement('dothiv:a');
        document.createElement('dothiv:b');
        document.createElement('dothiv:h1');
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
        return template;
    }

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
                manipulateDOM(config);
            }
        }

        // Send request TODO: send instead POST to correct url
        request.open("GET", "/data.json?firstvisit=" + firstVisit, true);
        request.send();
    }

    /**
     * Manipulate the DOM by inserting dotHIV banner and css code. This will be
     * done once the DOM is ready.
     */
    function manipulateDOM(config) {
        domready(function () {
            // Determine whether the status bar is short
            var shortBar = config.status < 20;

            // Determine which of the three banner versions to render
            if (firstVisit || (config.secondvisit != 'top' && config.secondvisit != 'right' && config.secondvisit != 'center'))
                switch(config.firstvisit) {
                    case 'center':
                        createCenterBanner(config, shortBar);
                        break;
                    case 'right':
                        createRightBanner(config, shortBar);
                        break;
                    default:
                        createTopBanner(config, shortBar);
                        break;
                }
            else
               switch(config.secondvisit) {
                     case 'top':
                         createTopBanner(config, shortBar);
                         break;
                     case 'center':
                        createCenterBanner(config, shortBar);
                        break;
                     default:
                         createRightBanner(config, shortBar);
                         break;
                }

            // Include styles for banner
            var styleElement = document.createElement('style');
            styleElement.type = 'text/css'
            styleElement.innerHTML = "@@include('../css/main.css')";
            document.head.appendChild(styleElement);
        });
    }
})();
