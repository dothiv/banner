/**
 * Control for right banner
 */
(function() {
    // These are grunt includes
    //@@include('domready.js')
    //@@include('json2.js')
    //@@include('banner-base.js')

    /**
     * Creates the 'right' version of the banner.
     */
    function customizeBanner(config) {
        // Parse template
        document.body.innerHTML = parse(document.body.innerHTML, config);

        // Determine whether the status bar is short
        var shortBar = config.status < 20;

        // Configure pink status bar
        document.getElementById("dothiv-rb-pinkbar").style.width = config.status + '%';

        // Register events for mouseover
        document.getElementById("dothiv-rb-container").onmouseover = function() {
            document.getElementById("dothiv-rb-container").className = 'dothiv-rb-mouseover';
        };
        document.getElementById("dothiv-rb-container").onmouseout = function(){
            document.getElementById("dothiv-rb-container").className = '';
        };
    }
})();
