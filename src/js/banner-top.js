/**
 * Creates the 'top' version of the banner and inserts it into the DOM.
 */
function createTopBanner(config, shortBar) {
    // Prepare template
    var bannerTemplate = "@@include('../banner-top.html')";
    var bannerHTML = parse(bannerTemplate, config);

    // Create banner HTML structure
    var bannerContainer = document.createElement('div');
    bannerContainer.id = 'dothiv-tb-container';
    bannerContainer.className = 'dothiv-container';
    bannerContainer.innerHTML = bannerHTML;
    document.body.insertBefore(bannerContainer, document.body.firstChild);

    // Register events for mouseover
    document.getElementById("dothiv-tb-statusbar").onmouseover = function() {
        document.getElementById("dothiv-tb-statusbar-large").style.display = 'block';
    };
    document.getElementById("dothiv-tb-statusbar").onmouseout = function(){
        document.getElementById("dothiv-tb-statusbar-large").style.display = 'none';
    };
}
