'use strict';

/**
 * Controls the left clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var windowHeight = $(window).height();

    function animateClickCounterEntry(clickcounter, duration, ease, completeFunc) {
        clickcounter.css({
            top: (windowHeight - clickcounter.height()) / 2,
            left: (-clickcounter.width() - shadowSize) * 2
        });
        clickcounter.animate({left: 0}, duration, ease, completeFunc);
    }

    function animateClickCounterExit(clickcounter, duration, ease, completeFunc) {
        clickcounter.animate({left: (-clickcounter.width() - shadowSize) * 2}, duration, ease, completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
