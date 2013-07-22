/**
 * This is the dotHIV banner control.
 *
 * Contact: http://dothiv.org
 */

(function() {
    /**
     * This function provides a reliable event for 'DOM ready'
     */
    !function (name, definition) {
      if (typeof module != 'undefined') module.exports = definition()
      else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
      else this[name] = definition()
    }('domready', function (ready) {
      var fns = [], fn, f = false
        , doc = document
        , testEl = doc.documentElement
        , hack = testEl.doScroll
        , domContentLoaded = 'DOMContentLoaded'
        , addEventListener = 'addEventListener'
        , onreadystatechange = 'onreadystatechange'
        , readyState = 'readyState'
        , loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
        , loaded = loadedRgx.test(doc[readyState])

      function flush(f) {
        loaded = 1
        while (f = fns.shift()) f()
      }

      doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
        doc.removeEventListener(domContentLoaded, fn, f)
        flush()
      }, f)

      hack && doc.attachEvent(onreadystatechange, fn = function () {
        if (/^c/.test(doc[readyState])) {
          doc.detachEvent(onreadystatechange, fn)
          flush()
        }
      })

      return (ready = hack ?
        function (fn) {
          self != top ?
            loaded ? fn() : fns.push(fn) :
            function () {
              try {
                testEl.doScroll('left')
              } catch (e) {
                return setTimeout(function() { ready(fn) }, 50)
              }
              fn()
            }()
        } :
        function (fn) {
          loaded ? fn() : fns.push(fn)
        })
    })

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
     * Show the secondary information layer on pink bar, indicating the number 
     * of clicks so far. The argument indicates whether the pink bar is short.
     */
    function showClicks(shortBar) {
        if (shortBar) {
            document.getElementById("dothiv-status-right").style.display = 'none';
            document.getElementById("dothiv-status-right-secondary").style.display = 'inline-block';
        } else {
            document.getElementById("dothiv-status-left").style.display = 'none';
            document.getElementById("dothiv-status-left-secondary").style.display = 'block';
        }
    }

    /**
     * Show the primary information layer on pink bar, indicating the activated
     * money. The argument indicates whether the pink bar is short.
     */
    function showMoney(shortBar) {
        if (shortBar) {
            document.getElementById("dothiv-status-right").style.display = 'inline-block';
            document.getElementById("dothiv-status-right-secondary").style.display = 'none';
        } else {
            document.getElementById("dothiv-status-left").style.display = 'block';
            document.getElementById("dothiv-status-left-secondary").style.display = 'none';
        }
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

        // Prepare template
        var bannerTemplate = "@@include('../banner.html')";
        var bannerHTML = parse(bannerTemplate, config);

        // Create banner HTML structure
        var bannerContainer = document.createElement('div');
        bannerContainer.id = 'dothiv-container';
        bannerContainer.innerHTML = bannerHTML;

        var bannerBackground = document.createElement('div');
        bannerBackground.id = 'dothiv-background';
        document.body.insertBefore(bannerBackground, document.body.firstChild);
        document.body.insertBefore(bannerContainer, document.body.firstChild);

        // Register events for removing the banner
        var removeBanner = function(){document.body.removeChild(bannerContainer); document.body.removeChild(bannerBackground)};
        document.getElementById("dothiv-close").onclick = document.getElementById("dothiv-background").onclick = removeBanner;

        // Configure pink status bar
        document.getElementById("dothiv-pinkbar").style.width = config.status + '%';
        if (shortBar)
            document.getElementById("dothiv-status-left").style.display = 'none';
        else
           document.getElementById("dothiv-status-right").style.display = 'none';

        // Register events for pink bar
        document.getElementById("dothiv-statusbar").onmouseover = function(){showClicks(shortBar)};
        document.getElementById("dothiv-statusbar").onmouseout = function(){showMoney(shortBar)};

        // Include styles for banner
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css'
        styleElement.innerHTML = "@@include('../css/main.css')";
        document.head.appendChild(styleElement);
    });
})();
