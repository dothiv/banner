/**
 * Check of we are on a touch device.
 *
 * @see http://stackoverflow.com/a/4819886
 * @returns {boolean}
 */
function isTouchDevice() {
    return 'ontouchstart' in window // works on most browsers
        || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0); // works on ie10, ie11
}


/**
 * Check for Internet Explorer
 *
 * @param ver Version to check for
 * @returns {boolean}
 */
function isIE(ver) {
    return getIE() == ver;
}

/**
 * Returns the Internet Explorer Version or NaN if not an IE.
 *
 * @return {int}
 */
function getIE()
{
    return parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1], 10);
}

/**
 * Add Date.now() if not present.
 */
if (typeof Date.now === "undefined") {
    Date.now = Date.now || function() { return +new Date; };
}
