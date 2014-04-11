/**
 * Control for right banner
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')
    //@@include('helpers.js')
    //@@include('banner-base.js')

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
        document.getElementById("dothiv-rb-pinkbar").style.width = config.status + '%';

        // Register events for mouseover
        document.body.onmouseover = function() {
            document.getElementById("dothiv-rb-container").className = 'dothiv-rb-mouseover';
        };
        document.body.onmouseout = function(){
            document.getElementById("dothiv-rb-container").className = '';
        };

        // Remove box shadow if we have to deal with IE9
        if (isIE(9)) {
            document.getElementById("dothiv-rb-container").style.boxShadow = 'none';
    }
})();
