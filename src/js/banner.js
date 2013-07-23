/**
 * This is the dotHIV banner control.
 *
 * Contact: http://dothiv.org
 */

(function() {

    @@include('domready.js')
    @@include('banner-center.js')
    @@include('banner-right.js')

    /**
     * This function parses the given template. 
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

    // When DOM is ready, insert dotHIV banner
    domready(function () {
        // Check if this is the first visit and if we can set cookies
        var firstVisit = false;
        if (!getCookie())
            firstVisit = setCookie() ? true : false;

        // Fetch banner configuration from dotHIV server
        // TODO: AJAX request the data
        // TODO: use information of first/second visit as query parameter
        var config = {
            status: 25,
            money: 736241,
            clickcount: 3257283,
            firstvisit: 'center',
            secondvisit: 'right',
            heading: 'Vielen Dank!',
            subheading: 'Dein Klick auf domain.hiv hat soeben einen Gegenwert von 1&thinsp;ct ausgel&ouml;st.',
            claim: 'Wir sind Teil der Bewegung',
            about: '&Uuml;ber dotHIV',
            vote: 'Vote',
            activated: 'Bisher aktiviert:',
            currency: '&euro;',
            corresponding: 'entspricht',
            clicks: 'Klicks',
        };

        var shortBar = config.status < 20;

        // Determine which of the three banner versions to render
        if (firstVisit || (config.secondvisit != 'top' && config.secondvisit != 'right'))
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
                 default:
                     createRightBanner(config, shortBar);
            }

        // Include styles for banner
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css'
        styleElement.innerHTML = "@@include('../css/main.css')";
        document.head.appendChild(styleElement);
    });
})();
