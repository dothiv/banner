'use strict';

/**
 * Controls the topright micro clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animateClickCounterEntry(clickcounter, duration, ease, completeFunc) {
        clickcounter.css({
            top: 0,
            right: (-clickcounter.width() - shadowSize) * 2
        });
        clickcounter.animate({right: 0}, duration, ease, completeFunc);
    }

    function animateClickCounterExit(clickcounter, duration, ease, completeFunc) {
        clickcounter.animate({right: (-clickcounter.width() - shadowSize) * 2}, duration, ease, completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
