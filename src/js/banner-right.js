/**
 * Creates the 'right' version of the banner and inserts it into the DOM.
 */
function createRightBanner(config, shortBar) {
    // Prepare template
    var bannerTemplate = "@@include('../banner-right.html')";
    var bannerHTML = parse(bannerTemplate, config);

    // Create banner HTML structure
    var bannerContainer = document.createElement('div');
    bannerContainer.id = 'dothiv-rb-container';
    bannerContainer.className = 'dothiv-container';
    bannerContainer.innerHTML = bannerHTML;
    document.body.insertBefore(bannerContainer, document.body.firstChild);

    // Register events for mouseover
    document.getElementById("dothiv-rb-container").onmouseover = function() {
        bannerContainer.className = 'dothiv-container dothiv-rb-mouseover';
    };
    document.getElementById("dothiv-rb-container").onmouseout = function(){
        bannerContainer.className = 'dothiv-container';
    };
}

