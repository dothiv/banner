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

        // Configure pink status bar
        document.getElementById("dothiv-rb-pinkbar").style.width = config.status + '%';

        if (isTouchDevice()) {
            // Register events for click (simulate mouse over on mobile devices)
            document.getElementById("dothiv-rb-container").onclick = function() {
                if (expanded) {
                    compact();
                } else {
                    expand();
                }
            }
        } else {
            // Register events for mouseover
            document.body.onmouseover = expand;
            document.body.onmouseout = compact;
        }

        // Remove box shadow if we have to deal with IE9
        if (isIE(9)) {
            document.getElementById("dothiv-rb-container").style.boxShadow = 'none';
        }
    }

    function expand()
    {
        expanded = true;
        window.parent.postMessage("expand","*");
        document.getElementById("dothiv-rb-container").className = 'dothiv-rb-mouseover';
    }

    function compact()
    {
        expanded = false;
        window.parent.postMessage("compact","*");
        document.getElementById("dothiv-rb-container").className = '';
    }
})();
