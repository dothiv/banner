/**
 * Control for top banner
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')
    //@@include('banner-base.js')

    /**
     * Creates the 'top' version of the banner.
     */
    function customizeBanner(config) {
        // Parse template
        document.body.innerHTML = parse(document.body.innerHTML, config);

        // Determine whether the status bar is short
        var shortBar = config.status < 20;

        // Configure pink status bar
        // TODO document.getElementById("dothiv-cb-pinkbar").style.width = config.status + '%';

        // Register events for removing the banner
        document.getElementById("dothiv-tb-close").onclick = function() {
            document.body.removeChild(bannerContainer);
        };

        // Register events for mouseover
        document.getElementById("dothiv-tb-container").onmouseover = function() {
            bannerContainer.className = 'dothiv-container dothiv-tb-mouseover';
            showLabel(shortBar);
        };
        document.getElementById("dothiv-tb-container").onmouseout = function(){
            bannerContainer.className = 'dothiv-container';
            hideLabel();
        };
    }

    /**
     * Label the pink bar according to its length.
     */
    function showLabel(shortBar) {
        if (shortBar)
            document.getElementById("dothiv-tb-status-right").style.display = 'inline-block';
        else
            document.getElementById("dothiv-tb-status-left").style.display = 'block';
    }

    /**
     * Hide label of pink bar.
     */
    function hideLabel() {
        document.getElementById("dothiv-tb-status-right").style.display = 'none';
        document.getElementById("dothiv-tb-status-left").style.display = 'none';
    }
})();
