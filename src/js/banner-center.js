/**
 * Control for center banner
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')
    //@@include('helpers.js')
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
        document.getElementById("dothiv-cb-pinkbar").style.width = (config.percent * 100) + '%';
        if (shortBar) {
            document.getElementById("dothiv-cb-status-left").style.display = 'none';
            document.getElementById("dothiv-cb-status-right").style.display = '';
        } else {
            document.getElementById("dothiv-cb-status-right").style.display = 'none';
            document.getElementById("dothiv-cb-status-left").style.display = '';
        }

        // Register events for removing the banner, if supported by browser
        if (!!window.postMessage)
            document.getElementById("dothiv-cb-close").onclick = function() { window.parent.postMessage("remove","*"); };
        else
           document.getElementById("dothiv-cb-close").style.display = 'none';
    }
})();
