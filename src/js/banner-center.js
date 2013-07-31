/**
 * Control for center banner
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')
    //@@include('banner-base.js')

    /**
     * Creates the 'center' version of the banner.
     */
    function customizeBanner(config) {
        // Parse template
        document.body.innerHTML = parse(document.body.innerHTML, config);

        // Make banner body visible
        document.body.style.display = 'block';

        // Determine whether the status bar is short
        var shortBar = isShortBar(config);

        // Configure pink status bar
        document.getElementById("dothiv-cb-pinkbar").style.width = config.status + '%';
        if (shortBar)
            document.getElementById("dothiv-cb-status-left").style.display = 'none';
        else
           document.getElementById("dothiv-cb-status-right").style.display = 'none';

        // Register events for pink bar
        document.getElementById("dothiv-cb-statusbar").onmouseover = function(){showClicks(shortBar);};
        document.getElementById("dothiv-cb-statusbar").onmouseout = function(){showMoney(shortBar);};

        // Register events for removing the banner, if supported by browser
        if (!!window.postMessage)
            document.getElementById("dothiv-cb-close").onclick = function() { window.parent.postMessage("remove","*"); };
        else
           document.getElementById("dothiv-cb-close").style.display = 'none';
    }

    /**
     * Show the secondary information layer on pink bar, indicating the number 
     * of clicks so far. The argument indicates whether the pink bar is short.
     */
    function showClicks(shortBar) {
        if (shortBar) {
            document.getElementById("dothiv-cb-status-right").style.display = 'none';
            document.getElementById("dothiv-cb-status-right-secondary").style.display = 'inline-block';
        } else {
            document.getElementById("dothiv-cb-status-left").style.display = 'none';
            document.getElementById("dothiv-cb-status-left-secondary").style.display = 'block';
        }
    }

    /**
     * Show the primary information layer on pink bar, indicating the activated
     * money. The argument indicates whether the pink bar is short.
     */
    function showMoney(shortBar) {
        if (shortBar) {
            document.getElementById("dothiv-cb-status-right").style.display = 'inline-block';
            document.getElementById("dothiv-cb-status-right-secondary").style.display = 'none';
        } else {
            document.getElementById("dothiv-cb-status-left").style.display = 'block';
            document.getElementById("dothiv-cb-status-left-secondary").style.display = 'none';
        }
    }
})();