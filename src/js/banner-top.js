/**
 * Creates the 'top' version of the banner and inserts it into the DOM.
 */
function createTopBanner(config, shortBar) {
    // Prepare template
    var bannerTemplate = '@@include("../banner-top.html")';
    var bannerHTML = parse(bannerTemplate, config);

    // Create banner HTML structure
    var bannerContainer = document.createElement('div');
    bannerContainer.id = 'dothiv-tb-container';
    bannerContainer.className = 'dothiv-container';
    bannerContainer.innerHTML = bannerHTML;
    document.body.insertBefore(bannerContainer, document.body.firstChild);

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
