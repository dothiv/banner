/**
 * Creates the 'center' version of the banner and inserts it into the DOM.
 */
function createCenterBanner(config, shortBar) {
    // Prepare template
    var bannerTemplate = '@@include("../banner-center.html")';
    var bannerHTML = parse(bannerTemplate, config);

    // Create banner HTML structure
    var bannerContainer = null;
    try {
        bannerContainer = document.createElement('<dothiv:div xmlns:dothiv="http://www.dothiv.org/bannerIE" class="dothiv-container">');
    } catch (e) {
        bannerContainer = document.createElement('dothiv:div');
        bannerContainer.setAttribute("xmlns:dothiv", "http://www.dothiv.org/banner");
        bannerContainer.className = 'dothiv-container';
    }
    bannerContainer.id = 'dothiv-cb-container';
    bannerContainer.innerHTML = bannerHTML;

    // Create background HTML structure
    var bannerBackground = null;
    try {
        var bannerBackground = document.createElement('<dothiv:div xmlns:dothiv="http://www.dothiv.org/bannerIE">');
    } catch (e) {
        var bannerBackground = document.createElement('dothiv:div');
        bannerBackground.setAttribute("xmlns:dothiv", "http://www.dothiv.org/banner");
    }
    bannerBackground.id = 'dothiv-cb-background';
    document.body.insertBefore(bannerBackground, document.body.firstChild);
    document.body.insertBefore(bannerContainer, document.body.firstChild);

    // Register events for removing the banner
    var removeBanner = function(){document.body.removeChild(bannerContainer); document.body.removeChild(bannerBackground)};
    document.getElementById("dothiv-cb-close").onclick = document.getElementById("dothiv-cb-background").onclick = removeBanner;

    // Configure pink status bar
    document.getElementById("dothiv-cb-pinkbar").style.width = config.status + '%';
    if (shortBar)
        document.getElementById("dothiv-cb-status-left").style.display = 'none';
    else
       document.getElementById("dothiv-cb-status-right").style.display = 'none';

    // Register events for pink bar
    document.getElementById("dothiv-cb-statusbar").onmouseover = function(){showClicks(shortBar)};
    document.getElementById("dothiv-cb-statusbar").onmouseout = function(){showMoney(shortBar)};
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
