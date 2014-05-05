/**
 * Control for top banner
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')
    //@@include('helpers.js')
    //@@include('banner-base.js')

    var topExpanded = false;

    /**
     * Creates the 'top' version of the banner.
     */
    function customizeBanner(config) {
        // Parse template
        document.body.innerHTML = parse(document.body.innerHTML, config);

        // Make banner body visible
        document.body.style.display = 'block';

        // Determine whether the status bar is short
        var shortBar = isShortBar(config);

        // Configure pink status bar
        document.getElementById("dothiv-tb-pinkbar").style.width = (config.percent * 100) + '%';

        // Register events for removing the banner, if supported by browser
        if (!!window.postMessage)
            document.getElementById("dothiv-tb-close").onclick = function() { window.parent.postMessage("remove","*"); };
        else
           document.getElementById("dothiv-tb-close").style.display = 'none';

        // Register events for mouseover
        if (isTouchDevice()) {
            document.getElementById("dothiv-tb-statusbar").onclick = function () {
                togglePinkBar(shortBar);
            };
        } else {
            document.getElementById("dothiv-tb-container").onmouseover = function () {
                expandPinkBar(shortBar);
            };
            document.getElementById("dothiv-tb-container").onmouseout = compactPinkBar;
        }
    }

    function compactPinkBar() {
        topExpanded = false;
        window.parent.postMessage("compact","*");
        document.getElementById("dothiv-tb-container").className = '';
        document.getElementById("dothiv-tb-status-right").style.display = 'none';
        document.getElementById("dothiv-tb-status-left").style.display = 'none';
    }

    function expandPinkBar(shortBar) {
        topExpanded = true;
        window.parent.postMessage("expand","*");
        document.getElementById("dothiv-tb-container").className = 'dothiv-tb-mouseover';
        if (shortBar) {
            document.getElementById("dothiv-tb-status-right").style.display = 'inline-block';
        } else {
            document.getElementById("dothiv-tb-status-left").style.display = 'block';
        }
    }

    function togglePinkBar(shortBar) {
        if (topExpanded) {
            compactPinkBar(shortBar);
        } else {
            expandPinkBar(shortBar);
        }
    }
})();
