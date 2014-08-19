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
 * Returns whether the browser is supported.
 *
 * @return {bool}
 */
function isSupportedBrowser()
{
    if (getIE() < 8) {
        return false;
    }
    return true;
}

/**
 * Add Date.now() if not present.
 */
if (typeof Date.now === "undefined") {
    Date.now = Date.now || function() { return +new Date; };
}
