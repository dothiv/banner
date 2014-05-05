/**
 * Control for right banner
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')
    //@@include('helpers.js')
    //@@include('banner-base.js')

    var expanded = false;

    /**
     * Creates the 'right' version of the banner.
     */
    function customizeBanner(config) {
        // Parse template
        document.body.innerHTML = parse(document.body.innerHTML, config);

        // Make banner body visible
        document.body.style.display = 'block';

        // Determine whether the status bar is short
        var shortBar = isShortBar(config);

        // Configure pink status bar
        document.getElementById("dothiv-rb-pinkbar").style.width = (config.percent * 100) + '%';

        // Register events for removing the banner, if supported by browser
        if (!!window.postMessage) {
            document.getElementById("dothiv-rb-close").onclick = function () {
                window.parent.postMessage("remove", "*");
            };
        }
        else {
            document.getElementById("dothiv-rb-close").style.display = 'none';
        }

        if (isTouchDevice()) {
            // Register events for click (simulate mouse over on mobile devices)
            document.getElementById("dothiv-rb-container").onclick = function() {
                if (expanded) {
                    compact();
                } else {
                    expand(shortBar, config);
                }
            }
        } else {
            // Register events for mouseover
            document.body.onmouseover = function() {
                expand(shortBar);
            };
            document.body.onmouseout = compact;
        }

        // Remove box shadow if we have to deal with IE9
        if (isIE(9)) {
            document.getElementById("dothiv-rb-container").style.boxShadow = 'none';
        }
    }

    function expand(shortBar, config)
    {
        expanded = true;
        window.parent.postMessage("expand","*");
        document.getElementById("dothiv-rb-container").className = 'dothiv-rb-mouseover';
        if (shortBar) {
            document.getElementById("dothiv-rb-status-right").style.display = 'inline-block';
            document.getElementById("dothiv-rb-status-left").style.display = 'none';
        } else {
            document.getElementById("dothiv-rb-status-left").style.display = 'inline-block';
            document.getElementById("dothiv-rb-status-right").style.display = 'none';
        }
    }

    function compact()
    {
        expanded = false;
        window.parent.postMessage("compact","*");
        document.getElementById("dothiv-rb-container").className = '';
        document.getElementById("dothiv-rb-status-right").style.display = 'none';
        document.getElementById("dothiv-rb-status-left").style.display = 'none';
    }
})();
