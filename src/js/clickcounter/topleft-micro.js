'use strict';

/**
 * Controls the topleft micro clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animateClickCounterEntry(clickcounter, duration, ease, completeFunc) {
        clickcounter.css({
            top: 0,
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
