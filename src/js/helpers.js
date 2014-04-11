/**
 * Check of we are on a touch device.
 *
 * @see http://stackoverflow.com/a/4819886
 * @returns {boolean}
 */
function isTouchDevice() {
    return 'ontouchstart' in window // works on most browsers
        || 'onmsgesturechange' in window; // works on ie10
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
